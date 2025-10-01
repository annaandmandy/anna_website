import React, { useEffect, useRef } from "react";
import * as LAppDefine from "../../public//live2d/src/lappdefine";
import { LAppDelegate } from "../../public/live2d/src/lappdelegate";

const Live2DViewer = () => {
    const initialized = useRef(false);
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        
        const delegate = LAppDelegate.getInstance();
        if (!delegate.initialize()) {
            console.warn("Live2D Failed to initialize.");
            return;
        }
        delegate.run();
        
    }, []);

    return (
        <div
            id="live2d-container"
            />
    ); 
};

export default Live2DViewer;
