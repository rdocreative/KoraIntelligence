import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/configuracoes`, // Redireciona para configurações onde pode mudar a senha
      });

      if (error) {
        throw error;
      }

      setSubmitted(true);
      toast.success("Link enviado!", {
        description: "Verifique seu email para redefinir sua senha.",
      });
    } catch (error: any) {
      toast.error("Erro ao enviar link", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md bg-[#121214] border-white/10 shadow-2xl relative z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white text-center">Recuperar Senha</CardTitle>
          <CardDescription className="text-center text-neutral-400">
            Digite seu email para receber o link de redefinição
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#0a0a0b] border-white/10 focus-visible:ring-red-500/50"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Enviar Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm text-neutral-300">
                Enviamos um link de recuperação para <strong>{email}</strong>.
              </p>
              <Button
                variant="outline"
                className="w-full border-white/10 text-white hover:bg-white/5"
                onClick={() => setSubmitted(false)}
              >
                Tentar outro email
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-white/5 pt-6">
          <Link to="/login" className="flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}