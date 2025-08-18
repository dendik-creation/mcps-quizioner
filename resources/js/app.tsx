import "./bootstrap";
import { createInertiaApp } from "@inertiajs/react";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./pages/**/*.tsx");
        return pages[`./pages/${name}.tsx`]();
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <Suspense fallback={<div>🔃 Load App</div>}>
                <App {...props} />
            </Suspense>
        );
    },
});
