import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ThankYouPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <Card className="border-luxury-gold/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl font-bold">Thank You!</CardTitle>
            <CardDescription className="text-lg">
              Your volunteer application has been submitted successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>
              We appreciate your interest in volunteering with us. Our team will review your application and reach out to you shortly.
            </p>
            <p>
              If you have any questions in the meantime, please don&apos;t hesitate to contact us.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline" className="mt-4">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
