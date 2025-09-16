import { Card} from "@/components/ui/card";
import RegisterForm from "./registerForm";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl">
      <RegisterForm/>
      </Card>
    </div>
  );
}
