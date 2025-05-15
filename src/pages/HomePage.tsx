import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, Recycle, MapPin } from 'lucide-react';
import Testimonial from '../components/Testimonial';

const HomePage: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "EcoWaste helped me find a reliable garbage collection service in my area. The process was seamless and I'm very satisfied with the company I found!",
      imageSrc: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      name: "Michael Rodriguez",
      role: "Business Owner",
      content: "As a small business owner, I needed a waste management solution that was both affordable and eco-friendly. EcoWaste connected me with the perfect service provider.",
      imageSrc: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300"
    },
    {
      name: "Emma Williams",
      role: "Property Manager",
      content: "Managing multiple properties meant finding a reliable waste collection service was crucial. EcoWaste simplified this process and improved our efficiency.",
      imageSrc: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-primary-800 text-white">
        <div
          className="absolute inset-0 bg-black opacity-50 z-0"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "overlay"
          }}
        ></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Find Reliable Waste Collection Services In Your Area
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Connect with trusted garbage collection companies that serve your region and meet your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/companies"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-accent-500 hover:bg-accent-600 transition-colors"
              >
                <Search size={20} className="mr-2" />
                Find Companies
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-700 transition-colors"
              >
                Register Your Company
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              EcoWaste makes finding the right waste management service simple and efficient
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Find</h3>
              <p className="text-gray-600">
                Search for waste collection companies that serve your specific region.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect</h3>
              <p className="text-gray-600">
                Easily get in touch with companies that match your waste management needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform hover:transform hover:scale-105">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle size={24} className="text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage</h3>
              <p className="text-gray-600">
                Effectively handle your waste with reliable, professional service providers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it — hear from people who've found their perfect waste management solution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                content={testimonial.content}
                imageSrc={testimonial.imageSrc}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to find your waste collection service?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who've found reliable waste management solutions through EcoWaste
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/companies"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-white text-primary-600 hover:bg-gray-100 transition-colors"
            >
              Find Companies
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-primary-600 transition-colors"
            >
              Register Your Company
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;