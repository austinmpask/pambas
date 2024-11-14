//Children
import PageWrapper from "src/components/PageWrapper";
import RegisterForm from "src/components/forms/RegisterForm";
import FunBackground from "src/components/funbackground/FunBackground";
import WelcomeCard from "src/components/WelcomeCard";

export default function RegisterPage() {
  return (
    <PageWrapper>
      <FunBackground />
      <div className="sm:grid sm:register-grid h-dvh">
        <div>
          <WelcomeCard />
        </div>
        <div>
          <RegisterForm />
        </div>
      </div>
    </PageWrapper>
  );
}
