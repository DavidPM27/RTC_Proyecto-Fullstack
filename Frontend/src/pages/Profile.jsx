import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  Grid,
  GridItem,
  Spinner,
  Button,
} from "@chakra-ui/react";
import {
  LuLeaf,
  LuDroplets,
  LuTrendingUp,
  LuSettings,
  LuFlame,
  LuUser,
  LuCalendar,
  LuMail,
} from "react-icons/lu";
import Menu from "../components/layout/Menu";
import GlassCard from "../components/ui/GlassCard";
import EditProfileDialog from "../components/common/EditProfileDialog";
import { useGarden } from "../hooks/useGarden";

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const PAGE_LOAD_TIME = Date.now();

const StatCard = ({ icon, value, label }) => (
  <GlassCard mb={0}>
    <Flex direction="column" align="center" p={{ base: 4, md: 6 }} gap={3}>
      <Box
        p={3}
        borderRadius="xl"
        bg="brand.700/50"
        border="1px solid"
        borderColor="brand.600"
      >
        <Icon as={icon} boxSize={5} color="text.secondary" />
      </Box>
      <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color="text.primary">
        {value}
      </Text>
      <Text fontSize="sm" color="text.secondary">
        {label}
      </Text>
    </Flex>
  </GlassCard>
);

const Profile = () => {
  const { myGarden, gardenLoading } = useGarden();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(() => {
    const token = getToken();
    if (!token) return false;
    return !!decodeToken(token);
  });

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const decoded = decodeToken(token);
    if (!decoded) return;
    fetch(`/api/users/${decoded.id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser({ email: decoded.email, role: decoded.role }))
      .finally(() => setUserLoading(false));
  }, []);

  const now = PAGE_LOAD_TIME;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  const totalPlants = myGarden.length;

  const wateredThisWeek = myGarden.filter((p) => {
    const lw = p.stats?.lastWatered;
    return lw && now - new Date(lw).getTime() < oneWeek;
  }).length;

  const healthyPlants = myGarden.filter((p) => {
    const lw = p.stats?.lastWatered;
    const freq = (p.stats?.wateringFrequency || 7) * 24 * 60 * 60 * 1000;
    return lw && now - new Date(lw).getTime() < freq;
  }).length;

  const wateredDayKeys = [
    ...new Set(
      myGarden
        .filter((p) => p.stats?.lastWatered)
        .map((p) => {
          const d = new Date(p.stats.lastWatered);
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    ),
  ];

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (wateredDayKeys.includes(key)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const roleLabel =
    user?.role === "admin" ? "Admin" : "Gardener";

  if (userLoading || gardenLoading) {
    return (
      <Flex as="main" minHeight="100vh" align="center" justify="center" bg="bg.primary">
        <Spinner size="lg" color="brand.500" />
      </Flex>
    );
  }

  const stats = [
    { icon: LuLeaf, value: totalPlants, label: "Total Plants" },
    { icon: LuDroplets, value: wateredThisWeek, label: "Watered This Week" },
    { icon: LuTrendingUp, value: healthyPlants, label: "Healthy Plants" },
  ];

  return (
    <Flex direction={{ base: "column", md: "row" }} minHeight="100vh" bg="bg.primary">
      <Menu />
      <Box
        as="section"
        flex="1"
        px={{ base: 6, md: 10, lg: 32 }}
        py={8}
        pb={{ base: 32, md: 8 }}
        w="100%"
      >
        {/* Page header */}
        <Flex justify="space-between" align="center" mb={8}>
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            color="text.primary"
          >
            My Profile
          </Text>
        </Flex>

        {/* User info card */}
        <GlassCard>
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "flex-start", sm: "center" }}
            gap={6}
            p={2}
            wrap="wrap"
          >
            {/* Avatar */}
            <Box
              borderRadius="full"
              overflow="hidden"
              boxSize={{ base: "80px", md: "96px" }}
              flexShrink={0}
              bg="brand.700"
              border="3px solid"
              borderColor="brand.600"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.username}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Icon as={LuUser} boxSize={10} color="text.secondary" />
              )}
            </Box>

            {/* Info */}
            <VStack align="flex-start" flex="1" gap={2}>
              <HStack gap={3} wrap="wrap">
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="bold"
                  color="text.primary"
                >
                  {user?.username || "User"}
                </Text>
                <Box
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg="brandSecondary.700/30"
                  border="1px solid"
                  borderColor="brandSecondary.600/40"
                >
                  <Text fontSize="xs" color="brandSecondary.500" fontWeight="medium">
                    {roleLabel}
                  </Text>
                </Box>
              </HStack>

              {user?.email && (
                <HStack gap={2} color="text.secondary">
                  <Icon as={LuMail} boxSize={4} />
                  <Text fontSize="sm">{user.email}</Text>
                </HStack>
              )}

              {memberSince && (
                <HStack gap={2} color="text.secondary">
                  <Icon as={LuCalendar} boxSize={4} />
                  <Text fontSize="sm">Member since {memberSince}</Text>
                </HStack>
              )}
            </VStack>

            {/* Day streak */}
            <Box
              bg="brand.700/60"
              borderRadius="2xl"
              p={5}
              textAlign="center"
              minW="100px"
              border="1px solid"
              borderColor="brand.600"
              flexShrink={0}
            >
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="bold"
                color="brandSecondary.500"
              >
                {streak}
              </Text>
              <Text
                fontSize="xs"
                color="text.secondary"
                letterSpacing="wider"
                mt={1}
              >
                DAY STREAK
              </Text>
              <Icon as={LuFlame} color="brandSecondary.500" mt={2} boxSize={4} />
            </Box>
          </Flex>
        </GlassCard>

        {/* Stats */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(3, 1fr)",
          }}
          gap={4}
          mb={8}
        >
          {stats.map(({ icon, value, label }) => (
            <GridItem key={label}>
              <StatCard icon={icon} value={value} label={label} />
            </GridItem>
          ))}
        </Grid>

        {/* Account Management */}
        <GlassCard mb={0}>
          <Flex
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}
            direction={{ base: "column", sm: "row" }}
            gap={4}
            p={2}
          >
            <VStack align="flex-start" gap={1}>
              <Text fontWeight="semibold" color="text.primary">
                Account Management
              </Text>
              <Text fontSize="sm" color="text.secondary">
                Manage your account settings and preferences
              </Text>
            </VStack>
            <HStack gap={3} flexShrink={0}>
              <Button
                variant="outline"
                size="sm"
                borderRadius="xl"
                borderColor="brand.600"
                color="text.primary"
                _hover={{ bg: "brand.700/60" }}
              >
                Change Password
              </Button>
              <EditProfileDialog user={user} onUserUpdated={setUser} />
            </HStack>
          </Flex>
        </GlassCard>
      </Box>
    </Flex>
  );
};

export default Profile;
