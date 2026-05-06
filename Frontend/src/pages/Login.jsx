import { useState } from "react";
import {
  Flex,
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Checkbox,
  Link as ChakraLink,
  Spinner,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { LuLeaf, LuMail, LuLock, LuEye, LuEyeOff, LuUser, LuArrowLeft, LuCheck } from "react-icons/lu";
import GlassCard from "../components/ui/GlassCard";
import ButtonCustom from "../components/ui/ButtonCustom";
import FieldForm from "../components/common/FieldForm";
import { loginUser, registerUser, resetPassword } from "../api/authApi";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const switchMode = (newMode) => {
    setMode(newMode);
    setApiError(null);
    setResetSuccess(false);
    reset();
  };

  const onSubmit = async (data) => {
    setApiError(null);
    setIsLoading(true);

    try {
      if (mode === "login") {
        const token = await loginUser(data.email, data.password);

        if (rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }

        navigate("/");
      } else if (mode === "register") {
        await registerUser({
          username: data.username,
          email: data.email,
          password: data.password,
        });

        // Auto-login after successful register
        const token = await loginUser(data.email, data.password);
        sessionStorage.setItem("token", token);
        navigate("/");
      } else if (mode === "forgot") {
        await resetPassword(data.email, data.newPassword);
        setResetSuccess(true);
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const password = watch("password");

  return (
    <Flex
      minHeight="100vh"
      align="center"
      justify="center"
      bg="bg.primary"
      px={4}
      py={8}
    >
      <GlassCard
        w="full"
        maxW="420px"
        p={{ base: 6, sm: 8 }}
        mb={0}
        bg="brand.800/70"
        borderColor="brand.600/40"
        boxShadow="0 25px 60px rgba(0,0,0,0.5)"
      >
        {/* Logo & Branding */}
        <VStack gap={1} mb={8}>
          <Box
            bg="brand.600"
            borderRadius="full"
            p={4}
            mb={2}
            boxShadow="0 8px 30px rgba(64, 145, 108, 0.3)"
          >
            <Icon as={LuLeaf} boxSize={8} color="text.primary" />
          </Box>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="text.primary"
            letterSpacing="tight"
          >
            HydroGrow
          </Text>
          <Text fontSize="sm" color="text.secondary">
            Your digital urban garden companion
          </Text>
        </VStack>

        {/* Tab Switcher (hidden during forgot mode) */}
        {mode !== "forgot" ? (
          <HStack
            bg="brand.900/60"
            borderRadius="xl"
            p={1}
            mb={8}
            w="full"
          >
            <Box
              flex={1}
              textAlign="center"
              py={2}
              px={4}
              borderRadius="lg"
              cursor="pointer"
              bg={mode === "login" ? "brand.400" : "transparent"}
              color={mode === "login" ? "white" : "text.secondary"}
              fontWeight="semibold"
              fontSize="sm"
              transition="all 0.3s ease"
              _hover={{
                bg: mode === "login" ? "brand.400" : "brand.700/50",
              }}
              onClick={() => switchMode("login")}
            >
              Login
            </Box>
            <Box
              flex={1}
              textAlign="center"
              py={2}
              px={4}
              borderRadius="lg"
              cursor="pointer"
              bg={mode === "register" ? "brand.400" : "transparent"}
              color={mode === "register" ? "white" : "text.secondary"}
              fontWeight="semibold"
              fontSize="sm"
              transition="all 0.3s ease"
              _hover={{
                bg: mode === "register" ? "brand.400" : "brand.700/50",
              }}
              onClick={() => switchMode("register")}
            >
              Sign Up
            </Box>
          </HStack>
        ) : (
          <VStack gap={1} mb={6}>
            <Text fontSize="lg" fontWeight="semibold" color="text.primary">
              Reset Password
            </Text>
            <Text fontSize="sm" color="text.secondary" textAlign="center">
              Enter your email and choose a new password
            </Text>
          </VStack>
        )}

        {/* Form */}
        {mode === "forgot" && resetSuccess ? (
          /* Success state after password reset */
          <VStack gap={4} py={4}>
            <Box
              bg="state.success/15"
              borderRadius="full"
              p={4}
            >
              <Icon as={LuCheck} boxSize={10} color="state.success" />
            </Box>
            <Text color="text.primary" fontWeight="semibold" fontSize="lg">
              Password Updated!
            </Text>
            <Text color="text.secondary" fontSize="sm" textAlign="center">
              Your password has been reset successfully. You can now sign in with your new password.
            </Text>
            <ButtonCustom
              variant="primary"
              textValue="Back to Sign In"
              width="full"
              size="lg"
              py={6}
              fontSize="md"
              onClick={() => switchMode("login")}
            />
          </VStack>
        ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={5} w="full">
            {/* Username (only for register) */}
            {mode === "register" && (
              <FieldForm label="Username" error={errors.username}>
                <Box position="relative" w="full">
                  <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                    color="text.secondary"
                    pointerEvents="none"
                  >
                    <Icon as={LuUser} boxSize={4} />
                  </Box>
                  <Box
                    as="input"
                    w="100%"
                    pl={10}
                    pr={4}
                    py={2.5}
                    bg="brand.900"
                    border="1px solid"
                    borderColor="brand.600"
                    borderRadius="xl"
                    color="text.primary"
                    fontSize="sm"
                    outline="none"
                    transition="all 0.2s"
                    _focus={{
                      borderColor: "brand.500",
                    }}
                    _placeholder={{ color: "text.secondary", opacity: 0.6, fontSize: "sm" }}
                    placeholder="your_username"
                    {...register("username", {
                      required: "Username is required",
                      minLength: { value: 3, message: "At least 3 characters" },
                    })}
                  />
                </Box>
              </FieldForm>
            )}

            {/* Email */}
            <FieldForm label="Email" error={errors.email}>
              <Box position="relative" w="full">
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={2}
                  color="text.secondary"
                  pointerEvents="none"
                >
                  <Icon as={LuMail} boxSize={4} />
                </Box>
                <Box
                  as="input"
                  w="100%"
                  pl={10}
                  pr={4}
                  py={2.5}
                  bg="brand.900"
                  border="1px solid"
                  borderColor="brand.600"
                  borderRadius="xl"
                  color="text.primary"
                  fontSize="sm"
                  outline="none"
                  transition="all 0.2s"
                  _focus={{
                    borderColor: "brand.500",
                  }}
                  _placeholder={{ color: "text.secondary", opacity: 0.6, fontSize: "sm" }}
                  placeholder="your@email.com"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                />
              </Box>
            </FieldForm>

            {/* Password (login & register) */}
            {mode !== "forgot" && (
            <FieldForm label="Password" error={errors.password}>
              <Box position="relative" w="full">
                <Box
                  position="absolute"
                  left={3}
                  top="50%"
                  transform="translateY(-50%)"
                  zIndex={2}
                  color="text.secondary"
                  pointerEvents="none"
                >
                  <Icon as={LuLock} boxSize={4} />
                </Box>
                <Box
                  as="input"
                  w="100%"
                  pl={10}
                  pr={12}
                  py={2.5}
                  bg="brand.900"
                  border="1px solid"
                  borderColor="brand.600"
                  borderRadius="xl"
                  color="text.primary"
                  fontSize="sm"
                  outline="none"
                  transition="all 0.2s"
                  _focus={{
                    borderColor: "brand.500",
                  }}
                  _placeholder={{ color: "text.secondary", opacity: 0.6, fontSize: "sm" }}
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "At least 6 characters",
                    },
                  })}
                />
                <Box
                  position="absolute"
                  right={3}
                  top="50%"
                  transform="translateY(-50%)"
                  cursor="pointer"
                  color="text.secondary"
                  transition="color 0.2s"
                  _hover={{ color: "text.primary" }}
                  onClick={() => setShowPassword(!showPassword)}
                  zIndex={2}
                >
                  <Icon as={showPassword ? LuEyeOff : LuEye} boxSize={4} />
                </Box>
              </Box>
            </FieldForm>
            )}

            {/* New Password (forgot mode) */}
            {mode === "forgot" && (
              <FieldForm label="New Password" error={errors.newPassword}>
                <Box position="relative" w="full">
                  <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                    color="text.secondary"
                    pointerEvents="none"
                  >
                    <Icon as={LuLock} boxSize={4} />
                  </Box>
                  <Box
                    as="input"
                    w="100%"
                    pl={10}
                    pr={12}
                    py={2.5}
                    bg="brand.900"
                    border="1px solid"
                    borderColor="brand.600"
                    borderRadius="xl"
                    color="text.primary"
                    fontSize="sm"
                    outline="none"
                    transition="all 0.2s"
                    _focus={{
                      borderColor: "brand.500",
                    }}
                    _placeholder={{ color: "text.secondary", opacity: 0.6, fontSize: "sm" }}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    {...register("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "At least 6 characters",
                      },
                    })}
                  />
                  <Box
                    position="absolute"
                    right={3}
                    top="50%"
                    transform="translateY(-50%)"
                    cursor="pointer"
                    color="text.secondary"
                    transition="color 0.2s"
                    _hover={{ color: "text.primary" }}
                    onClick={() => setShowPassword(!showPassword)}
                    zIndex={2}
                  >
                    <Icon as={showPassword ? LuEyeOff : LuEye} boxSize={4} />
                  </Box>
                </Box>
              </FieldForm>
            )}

            {/* Confirm Password (register & forgot) */}
            {(mode === "register" || mode === "forgot") && (
              <FieldForm label="Confirm Password" error={errors.confirmPassword}>
                <Box position="relative" w="full">
                  <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={2}
                    color="text.secondary"
                    pointerEvents="none"
                  >
                    <Icon as={LuLock} boxSize={4} />
                  </Box>
                  <Box
                    as="input"
                    w="100%"
                    pl={10}
                    pr={4}
                    py={2.5}
                    bg="brand.900"
                    border="1px solid"
                    borderColor="brand.600"
                    borderRadius="xl"
                    color="text.primary"
                    fontSize="sm"
                    outline="none"
                    transition="all 0.2s"
                    _focus={{
                      borderColor: "brand.500",
                    }}
                    _placeholder={{ color: "text.secondary", opacity: 0.6, fontSize: "sm" }}
                    placeholder="••••••••"
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => {
                        const compareWith = mode === "forgot" ? watch("newPassword") : password;
                        return value === compareWith || "Passwords do not match";
                      },
                    })}
                  />
                </Box>
              </FieldForm>
            )}

            {/* Remember me & Forgot password (login only) */}
            {mode === "login" && (
              <HStack justify="space-between" w="full">
                <HStack gap={2} cursor="pointer" onClick={() => setRememberMe(!rememberMe)}>
                  <Box
                    w={4}
                    h={4}
                    borderRadius="sm"
                    border="1px solid"
                    borderColor={rememberMe ? "brandSecondary.500" : "brand.600"}
                    bg={rememberMe ? "brandSecondary.500" : "transparent"}
                    transition="all 0.2s"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {rememberMe && (
                      <Text fontSize="10px" color="white" lineHeight="1">✓</Text>
                    )}
                  </Box>
                  <Text fontSize="sm" color="text.secondary">
                    Remember me
                  </Text>
                </HStack>
                <ChakraLink
                  fontSize="sm"
                  color="brandSecondary.500"
                  fontWeight="medium"
                  _hover={{ color: "brandSecondary.400", textDecoration: "none" }}
                  cursor="pointer"
                  onClick={() => switchMode("forgot")}
                >
                  Forgot Password?
                </ChakraLink>
              </HStack>
            )}

            {/* API Error message */}
            {apiError && (
              <Box
                w="full"
                bg="state.alert/10"
                border="1px solid"
                borderColor="state.alert/30"
                borderRadius="lg"
                px={4}
                py={2}
              >
                <Text color="state.alert" fontSize="sm" textAlign="center">
                  {apiError}
                </Text>
              </Box>
            )}

            {/* Submit Button */}
            <ButtonCustom
              variant="primary"
              textValue={
                isLoading ? (
                  <Spinner size="sm" color="black" />
                ) : mode === "login" ? (
                  "Sign In"
                ) : mode === "register" ? (
                  "Create Account"
                ) : (
                  "Reset Password"
                )
              }
              width="full"
              size="lg"
              py={6}
              fontSize="md"
              type="submit"
              disabled={isLoading}
            />

            {/* Back to login (forgot mode) */}
            {mode === "forgot" && (
              <HStack
                gap={1}
                cursor="pointer"
                onClick={() => switchMode("login")}
                transition="opacity 0.2s"
                _hover={{ opacity: 0.8 }}
              >
                <Icon as={LuArrowLeft} boxSize={4} color="text.secondary" />
                <Text fontSize="sm" color="text.secondary">
                  Back to Sign In
                </Text>
              </HStack>
            )}
          </VStack>
        </form>
        )}

        {/* Bottom toggle (hidden during forgot & success) */}
        {mode !== "forgot" && (
          <HStack justify="center" mt={6}>
            <Text fontSize="sm" color="text.secondary">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
            </Text>
            <ChakraLink
              fontSize="sm"
              fontWeight="semibold"
              color="brandSecondary.500"
              _hover={{ color: "brandSecondary.400", textDecoration: "none" }}
              cursor="pointer"
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </ChakraLink>
          </HStack>
        )}
      </GlassCard>
    </Flex>
  );
};

export default Login;
