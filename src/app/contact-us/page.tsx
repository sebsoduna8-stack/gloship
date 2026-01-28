"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/ui/PageHeader";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        return () => {
            // Cleanup Chatway on unmount to ensure it doesn't persist to other pages
            const script = document.getElementById('chatway-script');
            if (script) script.remove();

            const style = document.getElementById('hide-chatway-bubble');
            if (style) style.remove();

            // Remove any potential Chatway containers (they often use these IDs)
            const selectors = [
                '#chatway-widget-container',
                '.chatway-widget-container',
                '#chatway-container',
                'iframe[src*="chatway.app"]'
            ];
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });

            // If Chatway has a global instance, try to close/destroy it
            // @ts-ignore
            if (window.Chatway) {
                try {
                    // @ts-ignore
                    if (window.Chatway.close) window.Chatway.close();
                    // Some widgets have a destroy method
                    // @ts-ignore
                    if (window.Chatway.destroy) window.Chatway.destroy();
                } catch (e) {
                    console.error("Error cleaning up Chatway:", e);
                }
            }
        };
    }, []);

    const loadChatway = () => {
        if (scriptLoaded) {
            // @ts-ignore
            if (window.Chatway) {
                // @ts-ignore
                window.Chatway.open();
            }
            return;
        }

        // Add CSS to hide the bubble icon globally
        const style = document.createElement('style');
        style.id = 'hide-chatway-bubble';
        style.innerHTML = `
            div#chatway-widget-container, 
            .chatway-widget-container,
            iframe[src*="chatway.app/widget"] { 
                display: none !important; 
            }
            /* Only show the expanded chat */
            #chatway-widget-container.chatway-opened,
            .chatway-opened {
                display: block !important;
            }
        `;
        document.head.appendChild(style);

        const script = document.createElement('script');
        script.id = 'chatway-script';
        script.src = 'https://cdn.chatway.app/widget.js?id=TdVtxYG049oo';
        script.async = true;

        script.onload = () => {
            setScriptLoaded(true);
            setTimeout(() => {
                // @ts-ignore
                if (window.Chatway) {
                    // @ts-ignore
                    window.Chatway.open();
                }
            }, 500);
        };

        document.body.appendChild(script);
    };

    return (
        <div className="bg-[var(--background)] min-h-screen pb-20">
            <PageHeader
                title="Contact Us"
                subtitle="Get In Touch"
                image="https://images.unsplash.com/photo-1423666639041-f14d70fa4c4d?auto=format&fit=crop&q=80"
            />

            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div>
                        <span className="text-[var(--accent)] font-bold tracking-wider uppercase text-sm mb-2 block">Reach Out</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-[var(--font-montserrat)]">
                            Have Questions? <br /> We're Here to Help.
                        </h2>
                        <p className="text-gray-400 mb-10 text-lg">
                            Whether you need to ship a package or have a question about our services, our team is ready to assist you.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Our Location</h3>
                                    <p className="text-gray-400">123 Logistics Avenue, Business District, NY 10001, United States</p>
                                </div>
                            </div>

                        

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center text-[var(--accent)] flex-shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Email Us</h3>
                                    <p className="text-gray-400">gloshipperss@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Chat Card */}
                    <div className="bg-[#222] p-8 md:p-10 rounded-lg shadow-xl border border-[#333] flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-full flex items-center justify-center text-[var(--accent)] mb-6">
                            <Send size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 font-[var(--font-montserrat)]">Live Chat Support</h3>
                        <p className="text-gray-400 mb-8 text-lg max-w-md">
                            Get instant answers to your questions. Our support team is available 24/7 to assist you with all your shipping needs.
                        </p>
                        <button
                            onClick={loadChatway}
                            className="bg-[var(--accent)] text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-600 transition-colors uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                            Start Live Chat <Send size={18} />
                        </button>
                        <p className="text-gray-500 text-sm mt-6">
                            Average response time: &lt;2 minutes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
