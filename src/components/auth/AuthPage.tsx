"use client";

import { useMemo, useEffect, useState } from "react";
import AuthTabs from "./AuthTabs";
import ForgotPanel from "./ForgotPanel";
import LoginPanel from "./LoginPanel";
import RegisterPanel from "./RegisterPanel";
import { useRouter } from "next/navigation";
import { useUserLoginContext } from "@/context/userLogincontex";
import { motion, AnimatePresence } from "framer-motion"; // Enhanced cinematic micro-interactions

import BACKENDAPI from "@/API";

import type { AuthTab } from "./types";

const AuthPage = () => {
  const router = useRouter();
  const { setIsLoggedIn, setUserProfile } = useUserLoginContext();

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
        email: userValue,
        password: loginPass,
        machine_location: locationValue,
      });

      if (response.status >= 200 && response.status < 300) {
        const token = response.data?.data?.token;
        if (token) {
          localStorage.setItem("beanfarm_token", token);
        } else {
          console.error(
            "Token extraction failed! Check response structure.",
            response.data,
          );
        }
        localStorage.setItem("beanfarm_machine_location", locationValue);
        setLoginSuccess("Login successful. Redirecting to dashboard...");

        setIsLoggedIn(true);

        const userData = response.data?.data;

        if (userData) {
          setUserProfile({
            machineLocation: userData.machine_location || locationValue,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phoneNumber || "",
          });
        }
      } else {
        setLoginError("Unable to sign in. Please verify your credentials.");
      }
    } catch (error: string | any) {
      console.error("Login Error Breakdown:", error);

      const serverMessage =
        error?.response?.data?.message ||
        "Sign in failed. Check your connection or backend endpoint.";
      setLoginError(serverMessage);
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
          setIsLoggedIn(true);
          setUserProfile({
            machineLocation: location,
            firstName,
            lastName,
            email,
            phone,
          });
        }
        localStorage.setItem("beanfarm_machine_location", location);
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
  };

  return (
    <div
      className="relative overflow-hidden flex w-full flex-col bg-gradient-to-b from-[#11091f]/90 to-[#190c2b]/85 border border-white/[0.04] rounded-3xl px-6 py-8 md:p-10 backdrop-blur-3xl shadow-2xl transition-all duration-500"
      style={{
        boxShadow:
          "0 40px 80px -30px rgba(184, 147, 255, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.02)",
      }}
    >
      {/* Dynamic Network Mesh Matrix Backdrop Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none" />

      {/* Layered Cyber Ambient Aura Spheres */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full opacity-[0.14] blur-[120px] bg-[#b893ff] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full opacity-[0.06] blur-[120px] bg-[#4deeea] pointer-events-none" />

      {/* Navigation Tab Header Deck Container */}
      <div className="relative z-10 w-full mb-6 border-b border-white/[0.04] pb-2">
        <AuthTabs
          activeTab={activeTab === "forgot" ? "login" : activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setResetSent(false);
          }}
        />
      </div>

      {/* Animated Interface Workspace Console */}
      <div className="relative z-10 w-full flex-1">
        <AnimatePresence mode="wait">
          {activeTab === "login" && (
            <motion.div
              key="login-panel-node"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
          )}

          {activeTab === "register" && (
            <motion.div
              key="register-panel-node"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
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
            </motion.div>
          )}

          {activeTab === "forgot" && (
            <motion.div
              key="forgot-panel-node"
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ForgotPanel
                forgotEmail={forgotEmail}
                resetSent={resetSent}
                setResetSent={setResetSent}
                onForgotEmailChange={setForgotEmail}
                onSubmit={handleForgot}
                onBackToLogin={() => setActiveTab("login")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
