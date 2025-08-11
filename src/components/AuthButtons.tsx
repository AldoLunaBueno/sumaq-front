import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

  if (isLoading) return null;

  return (
    <div className="fixed top-3 right-3 z-50 flex gap-2">
      {!isAuthenticated ? (
        <Button size="sm" variant="outline" onClick={() => loginWithRedirect()}>
          Iniciar sesión
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin + "/login" } })}
        >
          Cerrar sesión
        </Button>
      )}
    </div>
  );
}
