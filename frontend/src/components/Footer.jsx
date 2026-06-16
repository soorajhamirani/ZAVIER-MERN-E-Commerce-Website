import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-zinc-400 py-16 px-4 mt-20 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-12 text-left">
        
        {/* Column 1: Get In Touch */}
        <div>
          <h3 className="text-white text-[10px] font-semibold tracking-widest uppercase mb-4">GET IN TOUCH</h3>
          <p className="text-[11px] leading-relaxed tracking-wider font-light mb-4 text-zinc-400">
            Visit our physical experience hubs:
            <span className="block mt-1 font-medium text-white">Karachi, Lahore & Islamabad</span>
          </p>
          <form className="flex border-b border-zinc-700 py-1">
            <input
              type="email"
              placeholder="ENTER EMAIL FOR NEWSLETTER"
              className="bg-transparent text-[9px] tracking-widest outline-none flex-grow text-white uppercase placeholder-zinc-600"
            />
            <button className="text-white text-[9px] font-semibold tracking-widest uppercase ml-2 hover:opacity-80">
              JOIN
            </button>
          </form>
        </div>

        {/* Column 2: Standard Support Links */}
        <div>
          <h3 className="text-white text-[10px] font-semibold tracking-widest uppercase mb-4">CUSTOMER SUPPORT</h3>
          <ul className="space-y-2.5 text-[11px] tracking-wider font-light">
            <li><a href="#" className="hover:text-white transition-colors">Nationwide Shipping & Delivery</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Exchange & Return Policies</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Traditional Size Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Order Tracking Hub</a></li>
          </ul>
        </div>

        {/* Column 3: Localized Collections Links */}
        <div>
          <h3 className="text-white text-[10px] font-semibold tracking-widest uppercase mb-4">OUR COLLECTIONS</h3>
          <ul className="space-y-2.5 text-[11px] tracking-wider font-light">
            <li>
              <Link to="/category/menswear" className="hover:text-white transition-colors">
                MENSWEAR COLLECTION
              </Link>
            </li>
            <li>
              <Link to="/category/womenswear" className="hover:text-white transition-colors">
                WOMENSWEAR COLLECTION
              </Link>
            </li>
            <li>
              <Link to="/category/childrenswear" className="hover:text-white transition-colors">
                CHILDRENSWEAR SELECTION
              </Link>
            </li>
            <li>
              <Link to="/category/winter%20collection" className="hover:text-white transition-colors">
                WINTER ANTHOLOGY
              </Link>
            </li>
            <li>
              <Link to="/category/summer%20essentials" className="hover:text-white transition-colors">
                SUMMER ESSENTIALS
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Developer Desk */}
        <div>
          <h3 className="text-white text-[10px] font-semibold tracking-widest uppercase mb-4">DEVELOPER DESK</h3>
          <p className="text-[12px] text-white font-serif-luxury tracking-wider font-medium mb-3">
            Designed and Developed by Sooraj Hamirani
          </p>
          <p className="text-[10px] leading-relaxed text-zinc-400 mb-4 font-light">
            Leveraging MERN stack capabilities for state-of-the-art visual architecture and database integrity.
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://github.com/soorajhamirani" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-1 text-[10px] font-semibold tracking-widest uppercase"
              title="GitHub Profile"
            >
              <Github className="h-4 w-4" />
              <span>GITHUB</span>
            </a>
            <a 
              href="https://soorajhamirani.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-1 text-[10px] font-semibold tracking-widest uppercase"
              title="Professional Portfolio"
            >
              <Globe className="h-4 w-4" />
              <span>PORTFOLIO</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Rights Ribbon */}
      <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-zinc-800 text-center text-[10px] tracking-widest font-light">
        <p className="text-center text-zinc-500 uppercase">
          © 2026 ZAVIER™ Online Shopping. All Rights Reserved. Created by Sooraj Hamirani.
        </p>
      </div>
    </footer>
  );
}
