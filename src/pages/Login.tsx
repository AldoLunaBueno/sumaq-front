import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header
        className="relative text-white px-6 pt-12 pb-8 bg-cover bg-center"
        style={{ backgroundImage: "url('fondoweb.png')" }}
      >
        <div className="bg-black bg-opacity-30 absolute inset-0"></div>
        <div className="relative text-center flex flex-col items-center">
          <div className="flex items-center gap-3">
            <img
              src="logo_sq1.png"
              alt="Logo TARPUQKUNA"
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold drop-shadow-lg">TARPUQKUNA</h1>
          </div>
          <h2 className="text-lg font-medium opacity-90 mt-2">Bienvenido</h2>
        </div>
      </header>

      <main className="px-6 py-10 max-w-md mx-auto">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h1 className="text-xl font-semibold mb-4 text-center">Inicia sesión</h1>

          <div className="grid gap-3">
            <Button
              className="w-full"
              size="lg"
              onClick={() =>
                loginWithRedirect({ appState: { returnTo: from } })
              }
              disabled={isLoading}
            >
              Iniciar sesión con correo
            </Button>

            <Button
              className="w-full"
              size="lg"
              variant="outline"
              onClick={() =>
                loginWithRedirect({
                  appState: { returnTo: from },
                  authorizationParams: {},
                  // For Universal Login with Google connection enabled in Auth0
                  // @ts-expect-error connection is supported at runtime
                  connection: "google-oauth2",
                })
              }
              disabled={isLoading}
            >
              Continuar con Google
            </Button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Serás redirigido al panel tras iniciar sesión correctamente.
        </p>
      </main>
    </div>
  );
}
