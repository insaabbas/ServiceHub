import { Link } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { 
  FaToilet, FaBolt, FaSeedling, FaHammer, FaPaintRoller, 
  FaTruck, FaKey, FaTools, FaFan, FaBug 
} from "react-icons/fa";
import { 
  MdCleaningServices, MdOutlineElectricalServices 
} from "react-icons/md";
import emailjs from "@emailjs/browser"; // ✅ make sure this is installed
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const services = [
    { name: "Plumbing", description: "Expert plumbing services", icon: <FaToilet /> },
    { name: "Electrical", description: "Professional electrical work", icon: <MdOutlineElectricalServices /> },
    { name: "Cleaning", description: "Home and office cleaning", icon: <MdCleaningServices /> },
    { name: "Gardening", description: "Garden maintenance & landscaping", icon: <FaSeedling /> },
    { name: "Carpentry", description: "Woodwork and furniture repair", icon: <FaHammer /> },
    { name: "Painting", description: "Interior & exterior painting", icon: <FaPaintRoller /> },
    { name: "Moving Services", description: "Home and office moving", icon: <FaTruck /> },
    { name: "Locksmith", description: "Door & lock repair", icon: <FaKey /> },
    { name: "Appliance Repair", description: "Repair of home appliances", icon: <FaTools /> },
    { name: "HVAC", description: "Air conditioning & ventilation", icon: <FaFan /> },
    { name: "Pest Control", description: "Insect & pest removal", icon: <FaBug /> },
    { name: "....More Services", description: "And many more services available", icon: <FaTools /> },
  ];

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      "service_lewll1h",   // Your Service ID
      "template_ty8a7pb",  // Your Template ID
      e.target,
      "gC6sp5gn4B-3wDrtq"  // Your Public Key
    ).then(
      () => toast.success(" Message sent successfully!"),
      (error) => toast.error("❌ Failed to send message: " + error.text)
    );
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans scroll-smooth">
      {/* Hero Section */}
      <section className="relative text-white -mt-0">
        <div className="relative w-full">
          <img
            src="/Gemini_Generated_Image_f2mfawf2mfawf2mf.jpg"
            alt="Hero"
            className="w-full h-auto object-contain"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          <div className="absolute inset-0 flex flex-col justify-center items-start max-w-6xl mx-auto px-6">
            <h1
              className="text-4xl md:text-5xl font-semibold mb-4 drop-shadow-lg"
              data-aos="fade-down"
            >
              Welcome to ServiceHub
            </h1>
            <p
              className="text-lg md:text-xl mb-6 max-w-2xl"
              data-aos="fade-up"
            >
              Your trusted platform to book reliable services anytime, anywhere.
            </p>
            <Link
              to="/register"
              className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold px-6 py-3 rounded-lg shadow-lg transition"
              data-aos="zoom-in"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50" id="services">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800" data-aos="fade-up">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="relative bg-white bg-opacity-90 backdrop-blur-md p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-6xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">{service.name}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 py-20" id="about">
        <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">About ServiceHub</h2>
          <p className="text-gray-700 mb-4">
            ServiceHub connects you with top-rated service providers in your area. From plumbing and electrical work to cleaning and gardening, we make booking services fast, safe, and reliable.
          </p>
          <p className="text-gray-700">
            With a simple interface and trusted professionals, we ensure that your home or office gets the best service every time.
          </p>
        </div>
      </section>

      {/* Contact Section with Background Image */}
      <section
        className="py-20 bg-cover bg-center"
        id="contact"
        style={{ backgroundImage: "url('/pic.jpg')" }}
      >
        <div className="max-w-6xl mx-auto px-4 flex justify-start" data-aos="fade-up">
          <div className="w-full md:w-1/2 lg:w-2/5 bg-white bg-opacity-90 p-6 rounded-xl shadow-lg backdrop-blur-sm">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Contact Us</h2>
            <p className="text-gray-700 mb-8 flex items-center gap-2 text-lg">
              📧 insaabbas675@gmail.com
            </p>
            <form className="space-y-4 max-w-md" onSubmit={sendEmail}>
              <input
                type="text"
                name="user_name"
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="email"
                name="user_email"
                placeholder="Your Email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                className="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 shadow-lg transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[#F9E3CA] to-[#D3E3F1] text-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ServiceHub. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#services" className="hover:text-blue-700 transition">Services</a>
            <a href="#about" className="hover:text-blue-700 transition">About</a>
            <a href="#contact" className="hover:text-blue-700 transition">Contact</a>
          </div>
        </div>
      </footer>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover draggable />
    </div>
  );
}

export default Home;
