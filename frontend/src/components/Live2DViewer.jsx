import React, { useEffect, useRef, useState } from "react";
import * as LAppDefine from "../live2d/src/lappdefine";
import { LAppDelegate } from "../live2d/src/lappdelegate";
import { useNavigate } from 'react-router-dom';

const Live2DViewer = () => {
    const initialized = useRef(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const navigate = useNavigate();
    const [modelName, setModelName] = useState('anna');

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
        // Wait a bit for initialization to complete
        setTimeout(() => {
            // Get the first subdelegate (index 0)
            const subdelegate = delegate._subdelegates?.at(0);
            if (subdelegate) {
                const live2DManager = subdelegate.getLive2DManager();

                console.log('Live2D Manager:', live2DManager);

                if (live2DManager) {
                    live2DManager.onUserTap = (area) => {
                        const modelName = live2DManager.getCurrentModelName();
                        console.log('Current Model Name:', modelName);
                        const modelDialog = live2DManager.getCurrentModelDialog();
                        if (modelDialog && modelDialog.length > 0) {
                            const randomIndex = Math.floor(Math.random() * modelDialog.length);
                            const message = modelDialog[randomIndex];
                            setDialogMessage(message);
                            setShowDialog(true);
                        } else {
                            setDialogMessage("╰(*°▽°*)╯");
                            setShowDialog(true);
                        }
                        setTimeout(() => {
                            setShowDialog(false);
                        }, 3000);
                    };

                }
            }
        }, 100); // Small delay to ensure initialization is complete
    }, []);



    return (
        <>
            <div id="live2d-canvas" />
            {showDialog && (
                <div>
                    <div>
                        <p className="live2d-dialog">
                            {dialogMessage}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Live2DViewer;
