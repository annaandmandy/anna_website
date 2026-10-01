import React, { useEffect, useRef, useState } from "react";
import * as LAppDefine from "../live2d/src/lappdefine";
import { LAppDelegate } from "../live2d/src/lappdelegate";
import { useNavigate, useLocation } from 'react-router-dom';

const Live2DViewer = () => {
    const initialized = useRef(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [footerVisible, setFooterVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Don't render Live2D on the onsen-game page
    if (location.pathname === '/onsen-game') {
        return null;
    }

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        const delegate = LAppDelegate.getInstance();
        if (!delegate.initialize()) {
            console.warn("Live2D Failed to initialize.");
            return;
        }
        delegate.run();

        // Access the Live2D manager through the subdelegate
        setTimeout(() => {
            const subdelegate = delegate._subdelegates?.at(0);
            if (subdelegate) {
                const live2DManager = subdelegate.getLive2DManager();

                if (live2DManager) {
                    live2DManager.onUserTap = (area) => {
                        console.log('Live2D Tapped');

                        const modelDialog = live2DManager.getCurrentModelDialog();
                        if (modelDialog && modelDialog.length > 0) {
                            const randomIndex = Math.floor(Math.random() * modelDialog.length);
                            const message = modelDialog[randomIndex];
                            setDialogMessage(message);
                            setShowDialog(true);
                        } else {
                            setDialogMessage("Hi there! I'm Anna's digital avatar.");
                            setShowDialog(true);
                        }
                        // Auto-hide after 4 seconds
                        setTimeout(() => {
                            setShowDialog(false);
                        }, 4000);
                    };
                }
            }
        }, 500);
    }, []);

    // On mobile the character sits on top of the footer links, so fade it out
    // while the footer is on screen (see .live2d-footer-visible in index.css)
    useEffect(() => {
        const footer = document.querySelector('.footer');
        if (!footer || typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            ([entry]) => setFooterVisible(entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        document.body.classList.toggle('live2d-footer-visible', footerVisible);
        return () => document.body.classList.remove('live2d-footer-visible');
    }, [footerVisible]);

    return (
        <>
            <div id="live2d-canvas" />
            {showDialog && (
                <div className="live2d-dialog fixed bottom-[350px] right-20 max-w-[240px] p-4 bg-white/95 backdrop-blur-sm border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl rounded-br-sm text-sm font-medium text-dark animate-bounce-in z-[101]">
                    <p className="leading-relaxed">
                        {dialogMessage}
                    </p>
                </div>
            )}
        </>
    );
};

export default Live2DViewer;
