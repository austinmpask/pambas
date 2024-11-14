//Children
import PageWrapper from "src/components/PageWrapper";
import LoginForm from "src/components/forms/LoginForm";
import FunBackground from "src/components/funbackground/FunBackground";

export default function LoginPage() {
  return (
    <PageWrapper>
      <FunBackground />
      <div className="h-dvh">
        <LoginForm />
      </div>
    </PageWrapper>
  );
}
