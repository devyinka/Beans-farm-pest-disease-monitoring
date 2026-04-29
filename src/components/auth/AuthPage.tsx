"use client";
import { useMemo, useEffect, useState } from "react";
import AuthTabs from "./AuthTabs";
import ForgotPanel from "./ForgotPanel";
import LoginPanel from "./LoginPanel";
import RegisterPanel from "./RegisterPanel";
import { useRouter } from "next/navigation";
import BACKENDAPI from "@/API";

import type { AuthTab } from "./types";

const AuthPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [machineLocation, setMachineLocation] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (loginSuccess) {
      timer = setTimeout(() => {
        router.push("/Dashboard");
      }, 1500);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loginSuccess, router]);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;
    return score;
  }, [password]);

  const strengthColor =
    passwordStrength < 50
      ? "#ff9340"
      : passwordStrength < 75
        ? "#f5c842"
        : "#8ee89b";

  const handleLogin = async () => {
    setLoginError("");
    setLoginSuccess("");

    const userValue = loginUser.trim();
    const locationValue = machineLocation.trim();

    if (!userValue || !loginPass || !locationValue) {
      setLoginError(
        "Please fill username/email, password, and machine location.",
      );
      return;
    }

    setIsLoginSubmitting(true);
    try {
      const response = await BACKENDAPI.post(`/auth/login`, {
        username: userValue,
        password: loginPass,
        machineLocation: locationValue,
      });

      if (response.status >= 200 && response.status < 300) {
        const token = response.data?.token ?? response.data?.user?.token;
        if (token) {
          localStorage.setItem("beanfarm_token", token);
        }
        setLoginSuccess("Login successful. Redirecting to dashboard...");
      } else {
        setLoginError("Unable to sign in. Please verify your credentials.");
      }
    } catch (error) {
      setLoginError(
        "Sign in failed. Check your connection or backend endpoint.",
      );
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleRegister = async () => {
    setLoginError("");
    setLoginSuccess("");

    if (password !== confirmPassword) {
      setLoginError("Passwords do not match.");
      return;
    }

    if (passwordStrength < 75) {
      setLoginError(
        "Your password is too weak. Please include numbers, uppercase, and symbols.",
      );
      return;
    }

    setIsLoginSubmitting(true);

    try {
      const response = await BACKENDAPI.post(`/auth/register`, {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        machine_location: location,
        password,
      });

      if (response.status === 201) {
        const token = response.data?.token ?? response.data?.user?.token;
        if (token) {
          localStorage.setItem("beanfarm_token", token);
        }
        setLoginSuccess("Registration successful. Redirecting...");
        router.push("/Dashboard");
      }
    } catch (error: string | any) {
      const serverMessage =
        error.response?.data?.message || "Registration failed.";
      setLoginError(serverMessage);
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleForgot = async () => {
    {
      let res;
      try {
        res = await BACKENDAPI.post(`/auth/forgot-password`, {
          email: forgotEmail,
        });
      } catch (error) {
        console.error("Error sending forgot password request", error);
      }
      if (res?.status === 200) {
        console.info("Forgot password request successful", res.data);
        setResetSent(true);
      }
    }
    setResetSent(true); //for testing
  };
  return (
    <div className="flex w-full flex-col bg-[linear-gradient(180deg,rgba(20,10,34,0.86)_0%,rgba(33,14,57,0.72)_100%)] px-6 py-10 backdrop-blur-[6px] lg:px-9">
      <AuthTabs
        activeTab={activeTab === "forgot" ? "login" : activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setResetSent(false);
        }}
      />

      {activeTab === "login" && (
        <LoginPanel
          loginUser={loginUser}
          loginPass={loginPass}
          machineLocation={machineLocation}
          onLoginUserChange={setLoginUser}
          onLoginPassChange={setLoginPass}
          onSubmit={handleLogin}
          onForgot={() => setActiveTab("forgot")}
          onSwitchRegister={() => setActiveTab("register")}
          onChangeMachineLocation={setMachineLocation}
          isSubmitting={isLoginSubmitting}
          errorMessage={loginError}
          successMessage={loginSuccess}
        />
      )}

      {activeTab === "register" && (
        <RegisterPanel
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          location={location}
          password={password}
          confirmPassword={confirmPassword}
          passwordStrength={passwordStrength}
          strengthColor={strengthColor}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onLocationChange={setLocation}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleRegister}
          onSwitchLogin={() => setActiveTab("login")}
          isSubmitting={isLoginSubmitting}
          errorMessage={loginError}
          successMessage={loginSuccess}
        />
      )}

      {activeTab === "forgot" && (
        <ForgotPanel
          forgotEmail={forgotEmail}
          resetSent={resetSent}
          setResetSent={setResetSent}
          onForgotEmailChange={setForgotEmail}
          onSubmit={handleForgot}
          onBackToLogin={() => setActiveTab("login")}
        />
      )}
    </div>
  );
};

export default AuthPage;
