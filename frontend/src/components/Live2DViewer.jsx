import React, { useEffect, useRef } from "react";
import { LAppDelegate } from "../live2d/src/lappdelegate";
import * as LAppDefine from "../live2d/src/lappdefine";

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
