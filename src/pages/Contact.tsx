import { useState } from "react";
import AnimatedText from "../components/ui/animation/animatedText";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError("There was an error sending your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <div className="h-full md:px-6">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-20">
          <div className="w-full">
            <AnimatedText
              phrases={["Contact Us"]}
              accentWords={["Contact"]}
              className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl"
              accentClassName="text-accent"
            />
            <AnimatedText
              phrases={["Have a question or feedback? Reach out to us."]}
              accentWords={["question", "feedback"]}
              className="mb-8 text-2xl md:text-3xl lg:text-4xl"
              accentClassName="text-accent"
            />
          </div>
        </div>

        <div className="my-5 grid grid-cols-1 gap-10 md:my-10 md:grid-cols-2">
          {/* Contact Information */}
          <div className="w-full rounded-lg border-2 border-gray-200 p-6">
            <h2 className="mb-6 text-2xl font-bold">Get In Touch</h2>
            
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">Email</h3>
              <p className="text-gray-700">support@financetracker.com</p>
            </div>
            
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">Phone</h3>
              <p className="text-gray-700">+45 91 78 03 89 </p>
            </div>
            
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">Address</h3>
              <p className="text-gray-700">
                Finance Tracker HQ<br />
                Finlandsgade 21  <br />
                8200 Aarhus N<br />
                Denmark
              </p>
            </div>
            
            <div>
              <h3 className="mb-2 text-lg font-semibold">Hours</h3>
              <p className="text-gray-700">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p className="text-gray-700">Weekend: Closed</p>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="w-full rounded-lg border-2 border-gray-200 p-6">
            <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>
            
            {submitSuccess && (
              <div className="mb-4 rounded-lg bg-green-100 p-4 text-green-700">
                Your message has been sent successfully! We'll get back to you soon.
              </div>
            )}
            
            {submitError && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-accent px-5 py-2.5 text-center text-white transition-colors duration-200 hover:bg-accent/90 focus:outline-none focus:ring-4 focus:ring-accent/50 disabled:opacity-70"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 