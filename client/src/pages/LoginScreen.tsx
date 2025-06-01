import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FaComments } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setError(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-whatsapp-green to-whatsapp-dark-green">
      <Card className="bg-white dark:bg-whatsapp-dark-surface rounded-3xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <CardContent className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-whatsapp-green rounded-full flex items-center justify-center mx-auto mb-4">
              <FaComments className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">XChat</h1>
            <p className="text-whatsapp-text dark:text-whatsapp-text-secondary">
              Chat like never before — fast, simple, free
            </p>
            <p className="text-sm text-whatsapp-text dark:text-whatsapp-text-secondary mt-1">
              🇳🇵 Nepali-first messaging
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white dark:bg-whatsapp-dark-elevated border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-white"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <img 
                  src="https://developers.google.com/identity/images/g-logo.png" 
                  alt="Google" 
                  className="w-5 h-5"
                />
              )}
              <span className="font-medium">
                {loading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </Button>

            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}

            <div className="text-xs text-center text-whatsapp-text-secondary">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
