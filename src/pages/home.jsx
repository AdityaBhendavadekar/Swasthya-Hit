import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
} from "@material-tailwind/react";
import { PageTitle, Footer } from "@/widgets/layout";
import { FeatureCard, TeamCard } from "@/widgets/cards";
import { featuresData, teamData, contactData } from "@/data";
import emailjs from "emailjs-com"; // Import EmailJS
import { motion } from "framer-motion"; // Import framer-motion for animation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon

// Home component export
export default function Home() {
  // State for form data
  const [hospitalName, setHospitalName] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Regex for email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const phoneRegex = /^[0-9]{10}$/;

  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email using regex
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Check if phone number is valid
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number.");
      return;
    }

    // Prepare the data to send to the template
    const formData = {
      hospitalName,
      email,
      contactPerson,
      phone,
      address,
    };

    // Send the form data using EmailJS
    emailjs
      .send("service_uyrechs", "template_f7eaga4", formData, "pO8ydqR19v5lkEz08")
      .then(
        (response) => {
          console.log("Email sent successfully:", response);
          alert("Request sent successfully!");
        },
        (error) => {
          console.log("Error sending email:", error);
          alert("Failed to send request. Please try again later.");
        }
      );
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header Section */}
      <div className="relative flex h-screen content-center items-center justify-center pt-12 pb-24">
        <div className="absolute top-0 h-full w-full bg-[url('/img/background-4.png')] bg-cover bg-center" />
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex flex-wrap items-center">
            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 2 }}
              >
               <Typography variant="h1" color="white" className="mb-4 font-black" style={{ fontSize: 'calc(1em + 20px)' }}>
  Swasthya-Hit
</Typography>

              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 2 }}
              >
                <Typography variant="lead" color="white" className="opacity-80">
                  - An Integrated Healthcare Management<br />
                  With real-time appointment scheduling, live queue tracking, and secure
                  patient-doctor interactions, we make healthcare more accessible and efficient.
                </Typography>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="-mt-20 bg-white px-4 pb-16 pt-8 text-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuresData.map(({ color, title, icon, description }) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <FeatureCard
                  color={color}
                  title={title}
                  icon={React.createElement(icon, {
                    className: "w-5 h-5 text-white",
                  })}
                  description={description}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Network Section (Black Background) */}
      <section className="relative bg-black py-12 px-4 text-white">
        <div className="container mx-auto">
          <PageTitle section="Our Network">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 2 }}
            >
              <Typography variant="h2" color="white" className="mb-4 font-black">
                Know our Spread
              </Typography>
            </motion.div>
            <span className="text-white">
              Our system offers a comprehensive solution that integrates seamlessly with
              broader healthcare modules, ensuring enhanced healthcare management and accessibility.
            </span>
          </PageTitle>
          <div className="mx-auto mt-8 mb-24 grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {contactData.map(({ title, icon, description }) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  color="transparent"
                  shadow={false}
                  className="text-center text-white"
                >
                  <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full bg-blue-gray-900 shadow-lg shadow-gray-500/20">
                    {React.createElement(icon, { className: "w-5 h-5 text-white" })}
                  </div>
                  <Typography variant="h5" color="white" className="mb-2">
                    {title}
                  </Typography>
                  <Typography className="font-normal text-white opacity-75">
                    {description}
                  </Typography>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section (White Background) */}
      <section className="bg-white px-4 pt-12 pb-24 text-black">
        <div className="container mx-auto">
          <PageTitle section="Our Team" heading="Here are Developers">
            We are Third Year Computer Engineering students of Vishwakarma Institute of Technology.
          </PageTitle>
          <div className="mt-8 grid grid-cols-1 gap-12 gap-x-24 md:grid-cols-2 xl:grid-cols-4">
            {teamData.map(({ img, name, position, socials }) => (
              <motion.div
                key={name}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <img
                    src={img}
                    alt={name}
                    className="w-[300px] h-[300px] object-cover rounded-half mx-auto"  // Tailwind classes applied here
                  />
                  <Typography variant="h5" color="black" className="mt-4 font-semibold">
                    {name}
                  </Typography>
                  <Typography variant="h6" color="gray" className="mt-1">
                    {position}
                  </Typography>
                  <div className="flex items-center gap-2 justify-center mt-3">
                    {socials.map(({ color, name }) => (
                      <IconButton key={name} color={color} variant="text">
                        <FontAwesomeIcon icon={['fab', name]} className="text-xl" />
                      </IconButton>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="relative bg-white py-16 px-4 text-black">
        <div className="container mx-auto">
          <PageTitle section="Contact Us">
            Get in Touch
          </PageTitle>
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl text-black">
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
              <Input
                label="Hospital Name"
                size="lg"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
              />
              <Input
                label="Email"
                size="lg"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Contact Person"
                size="lg"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
              <Input
                label="Phone Number"
                size="lg"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Textarea
                label="Hospital Address"
                size="lg"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mt-8">
              <Checkbox
                label="I agree to the terms and conditions"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
            </div>
            <div className="mt-8">
              <Button
                type="submit"
                color="blue"
                fullWidth
                disabled={!agreed}
              >
                Submit Request
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
