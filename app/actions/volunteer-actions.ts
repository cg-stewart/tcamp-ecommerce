"use server";

import { db } from "@/lib/db/drizzle";
import { volunteers } from "@/lib/db/schema";
import { volunteerSchema } from "@/lib/validations";
import { eq, desc, sql, inArray } from "drizzle-orm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Resend } from 'resend';
import twilio from 'twilio';

// Initialize Resend for email
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Twilio for SMS
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Submit a volunteer application - public action
 */
export async function submitVolunteerApplication(
  prevState: any,
  formData: FormData
) {
  try {
    // Extract form data
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const interests = formData.get("interests") as string;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !city || !state) {
      return {
        success: false,
        message: "Please fill out all required fields",
      };
    }
    
    // Check for database connection
    if (typeof db === 'undefined') {
      return {
        success: false,
        message: "Database connection error",
      };
    }

    // Get current user if authenticated (optional)
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;

    // Insert into database
    await db.insert(volunteers).values({
      firstName,
      lastName,
      email,
      phone,
      city,
      state,
      interests,
      status: "new",
      clerkId: user?.id || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      message: "Thank you for your volunteer application! We'll be in touch soon.",
    };
  } catch (error) {
    console.error("Volunteer application error:", error);
    return {
      success: false,
      message: "Failed to submit your volunteer application.",
    };
  }
}

/**
 * Get all volunteers - admin only action
 */
export async function getAllVolunteers() {
  try {
    // Check admin authorization
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Check admin role
    const metadata = sessionClaims?.metadata as { role?: string } || {};
    const isAdmin = metadata.role === 'admin';
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }
    
    // Check for database connection
    if (typeof db === 'undefined') {
      return {
        success: false,
        message: "Database connection error",
      };
    }

    const allVolunteers = await db
      .select()
      .from(volunteers)
      .orderBy(desc(volunteers.createdAt));
    return { success: true, data: allVolunteers };
  } catch (error) {
    return { success: false, message: "Failed to fetch volunteers." };
  }
}

/**
 * Update volunteer status - admin only action
 */
export async function updateVolunteerStatus(id: string, formData: FormData) {
  try {
    // Check admin authorization
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Check admin role
    const metadata = sessionClaims?.metadata as { role?: string } || {};
    const isAdmin = metadata.role === 'admin';
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }
    
    // Check for database connection
    if (typeof db === 'undefined') {
      return {
        success: false,
        message: "Database connection error",
      };
    }

    const status = formData.get("status") as string;
    
    await db
      .update(volunteers)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(volunteers.id, id));

    return {
      success: true,
      message: "Volunteer status updated successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update volunteer status.",
    };
  }
}

/**
 * Contact a volunteer via email or SMS - admin only action
 */
export async function contactVolunteer(id: string, formData: FormData) {
  try {
    // Check admin authorization
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Check admin role
    const metadata = sessionClaims?.metadata as { role?: string } || {};
    const isAdmin = metadata.role === 'admin';
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }
    
    // Check for database connection
    if (typeof db === 'undefined') {
      return {
        success: false,
        message: "Database connection error",
      };
    }

    // Get the volunteer details
    const [volunteer] = await db
      .select()
      .from(volunteers)
      .where(eq(volunteers.id, id));

    if (!volunteer) {
      return { success: false, message: "Volunteer not found" };
    }

    const contactMethod = formData.get("contactMethod") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!message) {
      return { success: false, message: "Message is required" };
    }
    
    // Send message based on contact method
    if (contactMethod === "email") {
      try {
        // Send email using Resend
        const { data, error } = await resend.emails.send({
          from: 'TCamp <noreply@your-domain.com>',
          to: [volunteer.email],
          subject: subject || 'Message from TCamp',
          html: `<div>
                  <h1>Hello ${volunteer.firstName},</h1>
                  <p>${message}</p>
                  <p>Best regards,<br/>TCamp Team</p>
                </div>`,
        });
        
        if (error) {
          console.error('Error sending email:', error);
          return { success: false, message: 'Failed to send email: ' + error.message };
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        return { success: false, message: 'Email service error' };
      }
    } else if (contactMethod === "sms") {
      try {
        // Send SMS using Twilio
        const result = await twilioClient.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: volunteer.phone
        });
        
        console.log('SMS sent with SID:', result.sid);
      } catch (smsError) {
        console.error('SMS sending error:', smsError);
        return { success: false, message: 'SMS service error' };
      }
    }

    // Update volunteer status to indicate they've been contacted
    if (typeof db !== 'undefined') {
      await db
        .update(volunteers)
        .set({
          status: "contacted",
          updatedAt: new Date(),
        })
        .where(eq(volunteers.id, id));
    }

    return {
      success: true,
      message: `Volunteer successfully contacted via ${contactMethod}!`,
    };
  } catch (error) {
    console.error("Error contacting volunteer:", error);
    return {
      success: false,
      message: "Failed to contact volunteer.",
    };
  }
}

/**
 * Bulk contact multiple volunteers - admin only action
 */
export async function bulkContactVolunteers(formData: FormData) {
  try {
    // Check admin authorization
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    // Check admin role
    const metadata = sessionClaims?.metadata as { role?: string } || {};
    const isAdmin = metadata.role === 'admin';
    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }
    
    // Check for database connection
    if (typeof db === 'undefined') {
      return {
        success: false,
        message: "Database connection error",
      };
    }

    const contactMethod = formData.get("contactMethod") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const volunteerIds = JSON.parse(formData.get("volunteerIds") as string);

    if (!message) {
      return { success: false, message: "Message is required" };
    }

    if (!volunteerIds || !Array.isArray(volunteerIds) || volunteerIds.length === 0) {
      return { success: false, message: "No volunteers selected" };
    }

    // Get all the selected volunteers
    const selectedVolunteers = await db
      .select()
      .from(volunteers)
      .where(inArray(volunteers.id, volunteerIds));

    if (selectedVolunteers.length === 0) {
      return { success: false, message: "No valid volunteers found" };
    }

    const results = { success: 0, failed: 0, errors: [] as string[] };

    // Send messages to all selected volunteers
    for (const volunteer of selectedVolunteers) {
      try {
        if (contactMethod === "email") {
          // Send email using Resend
          const { data, error } = await resend.emails.send({
            from: 'TCamp <noreply@your-domain.com>',
            to: [volunteer.email],
            subject: subject || 'Message from TCamp',
            html: `<div>
                    <h1>Hello ${volunteer.firstName},</h1>
                    <p>${message}</p>
                    <p>Best regards,<br/>TCamp Team</p>
                  </div>`,
          });
          
          if (error) {
            results.failed++;
            results.errors.push(`${volunteer.email}: ${error.message}`);
          } else {
            results.success++;
          }
        } else if (contactMethod === "sms") {
          // Send SMS using Twilio
          const result = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: volunteer.phone
          });
          
          results.success++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`${volunteer.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Update volunteer statuses to indicate they've been contacted
    if (typeof db !== 'undefined') {
      await db
        .update(volunteers)
        .set({
          status: "contacted",
          updatedAt: new Date(),
        })
        .where(inArray(volunteers.id, volunteerIds));
    }

    return {
      success: true,
      message: `Contacted ${results.success} volunteers successfully. ${results.failed > 0 ? `Failed to contact ${results.failed} volunteers.` : ''}`,
      results
    };
  } catch (error) {
    console.error("Error in bulk contact operation:", error);
    return {
      success: false,
      message: "Failed to contact volunteers.",
    };
  }
}
