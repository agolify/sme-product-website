import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { setPageMetadata } from "@/lib/seo";

const Contact = () => {
  useEffect(() => {
    setPageMetadata({
      title: "Contact Dawa Coffee Machines | Eastleigh, Nairobi",
      description:
        "Contact Dawa in Eastleigh, Nairobi for coffee machine sales, spare parts and commercial equipment enquiries. Call, WhatsApp or visit by appointment.",
      path: "/contact",
    });
  }, []);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://api.dawacoffeemachienesandaccessories.com/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            subject: formData.subject,
            message: `
            Phone: ${formData.phone || "N/A"}
            
            ${formData.message}
          `,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        alert(`❌ Failed to send: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("🚨 Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* header omitted for brevity... */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* left side info... */}
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Contact Information
            </h2>

            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Reach us directly
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <section className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-lg bg-primary/10 p-2.5">
                      <Phone
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">Call</h4>
                      <p className="text-sm text-muted-foreground">
                        For immediate assistance
                      </p>
                    </div>
                  </div>
                  <Button className="min-h-11 w-full" asChild>
                    <a href="tel:+254185066399">+254 185 066 399</a>
                  </Button>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Alternative:{" "}
                    <a
                      className="font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      href="tel:+254720983015"
                    >
                      +254 720 983 015
                    </a>
                  </p>
                </section>

                <section className="rounded-lg border border-border bg-card p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-lg bg-secondary/10 p-2.5">
                      <MessageCircle
                        className="h-5 w-5 text-secondary"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        WhatsApp
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Send us an enquiry
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    className="min-h-11 w-full"
                    asChild
                  >
                    <a
                      href="https://wa.me/254185066399?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20your%20equipment"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      Chat on WhatsApp
                    </a>
                  </Button>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Alternative:{" "}
                    <a
                      className="font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      href="https://wa.me/+254114100019?text=Hi%2C%20I%27d%20like%20to%20inquire%20about%20your%20equipment"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +254 114 100 019
                    </a>
                  </p>
                </section>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-muted-foreground">Adhappi@gmail.com</p>
                  <p className="text-sm text-muted-foreground">
                    We'll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Location</h3>
                  <p className="text-muted-foreground">
                    Nairobi, Kenya.
                    <br /> Eastleigh 1st Avenue, Melawa Rd at Bustan tower
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Visit our stores by appointment
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Business Hours
                  </h3>
                  <p className="text-muted-foreground">
                    Monday - Friday: 10:00 AM - 5:00 PM
                  </p>
                  <p className="text-muted-foreground">
                    Saturday: 9:00 AM - 12:00 PM
                  </p>
                  <p className="text-muted-foreground">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
          {/* Contact Form */}
          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you soon
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium mb-2"
                      >
                        First Name
                      </label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium mb-2"
                      >
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium mb-2"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
