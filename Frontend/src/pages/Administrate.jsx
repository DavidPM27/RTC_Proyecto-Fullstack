import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Icon,
  Spinner,
  Menu,
  Portal,
  Button,
} from "@chakra-ui/react";
import { LuUser, LuShield, LuChevronDown, LuCheck } from "react-icons/lu";
import Menubar from "../components/layout/Menu";
import GlassCard from "../components/ui/GlassCard";
import ButtonCustom from "../components/ui/ButtonCustom";
import { getAllUsers, changeUserRole } from "../api/authApi";
import { getCurrentUser } from "../utils/auth";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const ROLES = ["user", "admin"];

const RoleSelect = ({ value, onChange }) => (
  <Menu.Root
    onSelect={(details) => onChange(details.value)}
    positioning={{ placement: "bottom-end" }}
  >
    <Menu.Trigger asChild>
      <Button
        size="sm"
        variant="outline"
        minW="120px"
        borderRadius="lg"
        bg="brand.700/40"
        borderColor="brand.600"
        color="text.primary"
        fontWeight="medium"
        justifyContent="space-between"
        _hover={{ bg: "brand.700" }}
      >
        <HStack gap={2}>
          <Icon
            as={value === "admin" ? LuShield : LuUser}
            boxSize={4}
            color="brandSecondary.500"
          />
          <Text textTransform="capitalize">{value}</Text>
        </HStack>
        <Icon as={LuChevronDown} boxSize={4} color="text.secondary" />
      </Button>
    </Menu.Trigger>
    <Portal>
      <Menu.Positioner>
        <Menu.Content
          bg="bg.primary"
          border="1px solid"
          borderColor="brand.600"
          borderRadius="xl"
          boxShadow="lg"
          minW="120px"
        >
          {ROLES.map((role) => (
            <Menu.Item
              key={role}
              value={role}
              color="text.primary"
              _hover={{ bg: "brand.700" }}
              borderRadius="lg"
              gap={2}
              justifyContent="space-between"
            >
              <HStack gap={2}>
                <Icon
                  as={role === "admin" ? LuShield : LuUser}
                  boxSize={4}
                  color="brandSecondary.400"
                />
                <Text textTransform="capitalize">{role}</Text>
              </HStack>
              {value === role && (
                <Icon as={LuCheck} boxSize={4} color="brandSecondary.500" />
              )}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
  </Menu.Root>
);

const UserRow = ({ user, role, onRoleChange }) => (
  <GlassCard mb={0} p={3}>
    <Flex align="center" gap={4} wrap="wrap">
      {/* Avatar */}
      <Box
        borderRadius="full"
        overflow="hidden"
        boxSize="48px"
        flexShrink={0}
        bg="brand.700"
        border="2px solid"
        borderColor="brand.600"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.username}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Icon as={LuUser} boxSize={6} color="text.secondary" />
        )}
      </Box>

      {/* Name + email */}
      <VStack align="flex-start" flex="1" gap={0} minW="0">
        <Text fontWeight="semibold" color="text.primary" truncate w="100%">
          {user.username || "User"}
        </Text>
        {user.email && (
          <Text fontSize="sm" color="text.secondary" truncate w="100%">
            {user.email}
          </Text>
        )}
      </VStack>

      {/* Role selector */}
      <RoleSelect value={role} onChange={onRoleChange} />
    </Flex>
  </GlassCard>
);

const Administrate = () => {
  const [users, setUsers] = useState([]);
  const [originalRoles, setOriginalRoles] = useState({});
  const [editedRoles, setEditedRoles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const currentUserId = getCurrentUser()?.id;

  const loadUsers = async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers(token);
      const visible = data.filter((u) => u._id !== currentUserId);
      const roles = Object.fromEntries(visible.map((u) => [u._id, u.role]));
      setUsers(visible);
      setOriginalRoles(roles);
      setEditedRoles(roles);
    } catch (err) {
      setError(err.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changedIds = useMemo(
    () => users.map((u) => u._id).filter((id) => editedRoles[id] !== originalRoles[id]),
    [users, editedRoles, originalRoles]
  );

  const hasChanges = changedIds.length > 0;

  const handleRoleChange = (id, role) => {
    setEditedRoles((prev) => ({ ...prev, [id]: role }));
  };

  const handleCancel = () => {
    setEditedRoles(originalRoles);
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token || !hasChanges) return;
    setSaving(true);
    setError(null);
    try {
      await Promise.all(
        changedIds.map((id) => changeUserRole(id, editedRoles[id], token))
      );
      setOriginalRoles(editedRoles);
    } catch (err) {
      setError(err.message || "Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} minHeight="100vh" bg="bg.primary">
      <Menubar />
      <Flex
        as="section"
        direction="column"
        flex="1"
        height={{ base: "auto", md: "100vh" }}
        minHeight="100vh"
        px={{ base: 6, md: 10, lg: 32 }}
        pt={8}
        pb={{ base: 28, md: 6 }}
        w="100%"
        overflow="hidden"
      >
        {/* Header */}
        <Box flexShrink={0} mb={6}>
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="bold"
            color="text.primary"
          >
            Administrate
          </Text>
          <Text fontSize="sm" color="text.secondary" mt={1}>
            Manage user roles across the platform
            {!loading && ` · ${users.length} user${users.length === 1 ? "" : "s"}`}
          </Text>
        </Box>

        {/* Scrollable user list */}
        <Box flex="1" overflowY="auto" pr={{ base: 0, md: 2 }} mx={{ base: 0, md: -2 }} px={{ base: 0, md: 2 }}>
          {loading ? (
            <Flex align="center" justify="center" height="100%" py={20}>
              <Spinner size="lg" color="brand.500" />
            </Flex>
          ) : error ? (
            <Flex align="center" justify="center" height="100%" py={20}>
              <Text color="state.alert">{error}</Text>
            </Flex>
          ) : users.length === 0 ? (
            <Flex align="center" justify="center" height="100%" py={20}>
              <Text color="text.secondary">No other users to manage</Text>
            </Flex>
          ) : (
            <VStack gap={3} align="stretch" pb={2}>
              {users.map((user) => (
                <UserRow
                  key={user._id}
                  user={user}
                  role={editedRoles[user._id]}
                  onRoleChange={(role) => handleRoleChange(user._id, role)}
                />
              ))}
            </VStack>
          )}
        </Box>

        {/* Sticky footer */}
        <Flex
          flexShrink={0}
          gap={3}
          justify="flex-end"
          align="center"
          pt={4}
          mt={2}
          borderTop="1px solid"
          borderColor="brand.700"
        >
          {hasChanges && (
            <Text fontSize="sm" color="text.secondary" mr="auto">
              {changedIds.length} unsaved change{changedIds.length === 1 ? "" : "s"}
            </Text>
          )}
          <ButtonCustom
            variant="secondary"
            textValue="Cancel"
            width="auto"
            mt={0}
            onClick={handleCancel}
            disabled={!hasChanges || saving}
          />
          <ButtonCustom
            variant="primary"
            textValue={saving ? "" : "Save"}
            width="auto"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            loading={saving}
          >
            {saving && <Spinner size="sm" />}
          </ButtonCustom>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Administrate;
