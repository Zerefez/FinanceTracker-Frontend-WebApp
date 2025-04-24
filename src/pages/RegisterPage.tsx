
import Inner from "../components/Inner";
import { Register } from "../components/Register";

export function RegisterPage() {
    return (
        <Inner showHeader={false}>
            <section>

                <div className="min-h-screen flex items-center justify-center">
                    <Register></Register>
                </div>
            </section>

        </Inner>
    )
}

