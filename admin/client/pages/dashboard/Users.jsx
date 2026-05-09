import { useState, useEffect, useMemo } from 'react';
import { Users as UsersIcon, Eye, Trash2, Lock, Badge as BadgeIcon, Search, Filter } from 'lucide-react';
import Sidebar from '../../components/dashboard/Sidebar';
import Navbar from '../../components/dashboard/Navbar';
import '../../styles/dashboard.css';
import { getUsersApi, adminUpdateUserApi } from '../../apis/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '../../components/ui/alert-dialog';
import { Skeleton } from '../../components/ui/skeleton';
import { useToast } from '../../hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Checkbox } from '../../components/ui/checkbox';
export default function Users() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortDir, setSortDir] = useState('desc');
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Dialog / confirm states
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await getUsersApi({ page, limit: pageSize });
        if (!mounted) return;

        // normalize response shapes
        let data = [];
        let totalCount = 0;
        if (!res) {
          data = [];
        }
        else if (Array.isArray(res)) {
          data = res;
        }
        else if (res.data && Array.isArray(res.data)) {
          data = res.data;
          totalCount = res.pagination?.total ?? data.length;
        }
        else if (res.users && Array.isArray(res.users)) {
          data = res.users;
          totalCount = res.pagination?.total ?? data.length;
        }
        else {
          // fallback
          data = res.data || res || [];
        }

        setUsers(data || []);
        setTotal(totalCount || (data ? data.length : 0));
      } catch (err) {
        console.error('Fetch users failed', err);
        toast({ title: 'Error fetching users', description: err?.message || 'See console', variant: 'destructive' });
        setUsers([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => { mounted = false; };
  }, [page, pageSize]);

  // debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleQuickChangeRole = async (user) => {
    const uid = user._id || user.id;
    const currentRole = (user.role || '').toString();
    let newRole = 'User';
    if (currentRole.toLowerCase() === 'user') newRole = 'Moderator';
    else if (currentRole.toLowerCase() === 'moderator') newRole = 'Admin';
    else newRole = 'User';
    try {
      const res = await adminUpdateUserApi(uid, { role: newRole });
      const updated = res?.data || res;
      if (updated) {
        setUsers((prev) => prev.map((u) => {
          const id = u._id || u.id;
          const updatedId = updated._id || updated.id;
          if (id === updatedId) return updated;
          return u;
        }));
        toast({ title: 'Role updated', description: `${updated.username || updated.email || 'User'} is now ${updated.role || newRole}` });
      }
    } catch (err) {
      console.error('Change role failed', err);
      toast({ title: 'Error', description: 'Unable to change role', variant: 'destructive' });
    }
  };

  const handleToggleSuspend = async (user) => {
    const uid = user._id || user.id;
    const currentStatus = (user.status || '').toString().toLowerCase();
    const newStatus = currentStatus === 'active' || currentStatus === 'Active' ? 'suspended' : 'active';
    try {
      const res = await adminUpdateUserApi(uid, { status: newStatus });
      const updated = res?.data || res;
      if (updated) {
        setUsers((prev) => prev.map((u) => {
          const id = u._id || u.id;
          const updatedId = updated._id || updated.id;
          if (id === updatedId) return updated;
          return u;
        }));
        toast({ title: 'Status updated', description: `${updated.username || updated.email || 'User'} status: ${updated.status}` });
      }
    } catch (err) {
      console.error('Toggle suspend failed', err);
      toast({ title: 'Error', description: 'Unable to update status', variant: 'destructive' });
    }
  };

  const handleBanUser = async (targetUser) => {
    if (!targetUser) return;
    const uid = targetUser._id || targetUser.id;
    try {
      const res = await adminUpdateUserApi(uid, { status: 'banned' });
      const updated = res?.data || res;
      if (updated) {
        setUsers((prev) => prev.map((u) => {
          const id = u._id || u.id;
          const updatedId = updated._id || updated.id;
          if (id === updatedId) return updated;
          return u;
        }));
        toast({ title: 'User banned', description: `${updated.username || updated.email || 'User'} was banned`, variant: 'destructive' });
      }
    } catch (err) {
      console.error('Ban failed', err);
      toast({ title: 'Error', description: 'Unable to ban user', variant: 'destructive' });
    } finally {
      setIsConfirmOpen(false);
      setConfirmTarget(null);
    }
  };

  const filtered = useMemo(() => users
    .filter((user) => {
      const name = (user.name || user.username || '').toString();
      const email = (user.email || '').toString();
      const role = (user.role || '').toString();
      const status = (user.status || '').toString();
      const matchesSearch = name.toLowerCase().includes(debouncedSearch.toLowerCase()) || email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesRole = roleFilter === 'All' || role.toLowerCase() === roleFilter.toLowerCase();
      const matchesStatus = statusFilter === 'All' || status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'name')
        return dir * (('' + (a.name || a.username || '')).localeCompare('' + (b.name || b.username || '')));
      if (sortBy === 'date')
        return dir * (new Date(b.joinDate || b.createdAt).getTime() - new Date(a.joinDate || a.createdAt).getTime());
      if (sortBy === 'role')
        return dir * (('' + (a.role || '')).localeCompare('' + (b.role || '')));
      return 0;
    }), [users, debouncedSearch, roleFilter, statusFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil((total || filtered.length) / pageSize));
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2 className="section-title">
              <UsersIcon size={24} />
              Users Management
            </h2>

            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
                <div style={{ width: 360 }}>
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or email..." />
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                  <Filter size={14} />
                  <span style={{ marginLeft: 6 }}>{showFilters ? 'Hide Filters' : 'Filters'}</span>
                </Button>
                <div style={{ marginLeft: 'auto', fontSize: 13, color: '#666' }}>
                  Showing {filtered.length} of {total || users.length} users
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                  <div>
                    <label className="filter-label">Role</label>
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="filter-input" style={{ width: '100%' }}>
                      <option>All</option>
                      <option>User</option>
                      <option>Moderator</option>
                      <option>Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="filter-label">Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-input" style={{ width: '100%' }}>
                      <option>All</option>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Suspended</option>
                      <option>Banned</option>
                    </select>
                  </div>
                  <div>
                    <label className="filter-label">Sort By</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-input" style={{ width: '100%' }}>
                      <option value="name">Name</option>
                      <option value="date">Join Date</option>
                      <option value="role">Role</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>
                        <Checkbox
                          checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                          onCheckedChange={(val) => {
                            if (val) setSelectedIds(filtered.map((u) => u._id || u.id));
                            else setSelectedIds([]);
                          }}
                        />
                      </th>
                      <th onClick={() => { if (sortBy === 'name') setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); setSortBy('name'); }} style={{ cursor: 'pointer' }}>Name</th>
                      <th>Email</th>
                      <th onClick={() => { if (sortBy === 'role') setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); setSortBy('role'); }} style={{ cursor: 'pointer' }}>Role</th>
                      <th>Status</th>
                      <th onClick={() => { if (sortBy === 'date') setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); setSortBy('date'); }} style={{ cursor: 'pointer' }}>Join Date</th>
                      <th>Last Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      // show skeleton rows
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={`skeleton-${i}`}>
                          <td><Skeleton className="h-4 w-4" /></td>
                          <td><Skeleton className="h-4 w-40" /></td>
                          <td><Skeleton className="h-4 w-56" /></td>
                          <td><Skeleton className="h-4 w-20" /></td>
                          <td><Skeleton className="h-4 w-20" /></td>
                          <td><Skeleton className="h-4 w-24" /></td>
                          <td><Skeleton className="h-4 w-36" /></td>
                          <td><Skeleton className="h-4 w-64" /></td>
                        </tr>
                      ))
                    ) : (
                      filtered.map((user) => {
                        const uid = user._id || user.id || user.username || JSON.stringify(user);
                        const displayName = user.name || user.username || user.email || 'Unknown';
                        const email = user.email || '';
                        const roleNorm = (user.role || '').toString().toLowerCase();
                        const roleLabel = user.role ? `${user.role.charAt(0)}${user.role.slice(1).toLowerCase()}` : 'User';
                        const statusNorm = (user.status || '').toString().toLowerCase();
                        const statusLabel = user.status ? `${user.status.charAt(0).toUpperCase()}${user.status.slice(1)}` : 'Active';
                        const joinDate = (user.joinDate || user.createdAt) ? new Date(user.joinDate || user.createdAt).toLocaleDateString() : '-';
                        const lastActive = (user.lastActive || user.updatedAt) ? new Date(user.lastActive || user.updatedAt).toLocaleString() : '-';
                        const isSelected = selectedIds.includes(uid);
                        const initials = (displayName.split(' ').map(s => s[0]).slice(0,2).join('') || displayName.slice(0,2)).toUpperCase();
                        const AVATAR_COLORS = { gray: '#9CA3AF', blue: '#3B82F6', purple: '#8B5CF6', red: '#EF4444', green: '#10B981', yellow: '#F59E0B', pink: '#EC4899' };
                        const avatarBg = AVATAR_COLORS[(user.avatarColor || 'gray')] || AVATAR_COLORS.gray;
                        return (
                          <tr key={uid}>
                            <td>
                              <Checkbox checked={isSelected} onCheckedChange={(v) => {
                                if (v) setSelectedIds((s) => [...s, uid]);
                                else setSelectedIds((s) => s.filter((x) => x !== uid));
                              }} />
                            </td>
                            <td style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <Avatar>
                                {user.profilePicture ? (
                                  <AvatarImage src={user.profilePicture} alt={displayName} />
                                ) : (
                                  <AvatarFallback style={{ backgroundColor: avatarBg }}>{initials}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <strong>{displayName}</strong>
                                <div style={{ fontSize: 12, color: '#666' }}>{user.username || ''}</div>
                              </div>
                            </td>
                            <td>{email}</td>
                            <td>
                              <select value={user.role || 'USER'} onChange={async (e) => {
                                const newRole = e.target.value;
                                try {
                                  const res = await adminUpdateUserApi(uid, { role: newRole });
                                  const updated = res?.data || res;
                                  if (updated) {
                                    setUsers((prev) => prev.map((u) => {
                                      const id = u._id || u.id;
                                      const updatedId = updated._id || updated.id;
                                      if (id === updatedId) return updated;
                                      return u;
                                    }));
                                    toast({ title: 'Role updated', description: `${updated.username || updated.email || 'User'} is now ${updated.role}` });
                                  }
                                } catch (err) {
                                  console.error('Inline role change failed', err);
                                  toast({ title: 'Error', description: 'Failed to update role', variant: 'destructive' });
                                }
                              }} className="filter-input">
                                <option value="USER">User</option>
                                <option value="MODERATOR">Moderator</option>
                                <option value="ADMIN">Admin</option>
                              </select>
                            </td>
                            <td>
                              <span className={`badge badge-${statusNorm === 'active' ? 'success' : statusNorm === 'inactive' ? 'secondary' : statusNorm === 'suspended' ? 'warning' : 'danger'}`}>
                                {statusLabel}
                              </span>
                            </td>
                            <td>{joinDate}</td>
                            <td>{lastActive}</td>
                            <td>
                              <div className="action-buttons" style={{ display: 'flex', gap: 8 }}>
                                <Button size="sm" variant="outline" onClick={() => { setSelectedUser(user); setIsDialogOpen(true); }} title="View Profile">
                                  <Eye size={14} />
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => handleToggleSuspend(user)} title="Suspend / Activate">
                                  <Lock size={14} />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => handleQuickChangeRole(user)} title="Change Role">
                                  <BadgeIcon size={14} />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => { setConfirmTarget(user); setIsConfirmOpen(true); }} title="Ban">
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bulk action bar */}
            {selectedIds.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 13 }}>{selectedIds.length} selected</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button size="sm" variant="ghost" onClick={() => {
                    // bulk promote to moderator
                    Promise.allSettled(selectedIds.map((id) => adminUpdateUserApi(id, { role: 'MODERATOR' }))).then((results) => {
                      const updated = results.filter(r => r.status === 'fulfilled').map(r => (r.status === 'fulfilled' ? (r.value?.data || r.value) : null)).filter(Boolean);
                      if (updated.length) {
                        setUsers((prev) => prev.map((u) => updated.find(up => (up._id || up.id) === (u._id || u.id)) || u));
                        toast({ title: 'Bulk update', description: `${updated.length} users promoted` });
                      }
                      setSelectedIds([]);
                    }).catch((e) => {
                      toast({ title: 'Error', description: 'Bulk promote failed', variant: 'destructive' });
                    });
                  }}>Promote to Moderator</Button>
                  <Button size="sm" variant="secondary" onClick={() => {
                    Promise.allSettled(selectedIds.map((id) => adminUpdateUserApi(id, { status: 'suspended' }))).then((results) => {
                      const updated = results.filter(r => r.status === 'fulfilled').map(r => (r.status === 'fulfilled' ? (r.value?.data || r.value) : null)).filter(Boolean);
                      if (updated.length) {
                        setUsers((prev) => prev.map((u) => updated.find(up => (up._id || up.id) === (u._id || u.id)) || u));
                        toast({ title: 'Bulk update', description: `${updated.length} users suspended` });
                      }
                      setSelectedIds([]);
                    }).catch((e) => {
                      toast({ title: 'Error', description: 'Bulk suspend failed', variant: 'destructive' });
                    });
                  }}>Suspend</Button>
                  <Button size="sm" variant="destructive" onClick={() => {
                    // Confirm then ban
                    if (!window.confirm(`Ban ${selectedIds.length} users?`)) return;
                    Promise.allSettled(selectedIds.map((id) => adminUpdateUserApi(id, { status: 'banned' }))).then((results) => {
                      const updated = results.filter(r => r.status === 'fulfilled').map(r => (r.status === 'fulfilled' ? (r.value?.data || r.value) : null)).filter(Boolean);
                      if (updated.length) {
                        setUsers((prev) => prev.map((u) => updated.find(up => (up._id || up.id) === (u._id || u.id)) || u));
                        toast({ title: 'Bulk update', description: `${updated.length} users banned`, variant: 'destructive' });
                      }
                      setSelectedIds([]);
                    }).catch((e) => {
                      toast({ title: 'Error', description: 'Bulk ban failed', variant: 'destructive' });
                    });
                  }}>Ban</Button>
                </div>
              </div>
            )}

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <div style={{ color: '#666', fontSize: 13 }}>
                Page {page} of {totalPages}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="filter-input">
                  <option value={5}>5 / page</option>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                </select>
              </div>
            </div>

            {/* View / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>View user</DialogTitle>
                  <DialogDescription>Inspect and manage this user.</DialogDescription>
                </DialogHeader>

                {selectedUser ? (
                  <div>
                    <div style={{ marginBottom: 12 }}>
                      <strong>{selectedUser.name || selectedUser.username}</strong>
                      <div style={{ color: '#666', fontSize: 13 }}>{selectedUser.email}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label className="filter-label">Role</label>
                        <select defaultValue={selectedUser.role || 'User'} onChange={(e) => setSelectedUser((s) => ({ ...s, role: e.target.value }))} className="filter-input" />
                      </div>
                      <div>
                        <label className="filter-label">Status</label>
                        <select defaultValue={selectedUser.status || 'active'} onChange={(e) => setSelectedUser((s) => ({ ...s, status: e.target.value }))} className="filter-input" />
                      </div>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <label className="filter-label">About</label>
                      <div style={{ color: '#444' }}>{selectedUser.bio || selectedUser.description || '-'}</div>
                    </div>
                  </div>
                ) : (
                  <div>Loading...</div>
                )}

                <DialogFooter>
                  <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                  <Button size="sm" onClick={async () => {
                    if (!selectedUser) return;
                    try {
                      const res = await adminUpdateUserApi(selectedUser._id || selectedUser.id, { role: selectedUser.role, status: selectedUser.status });
                      const updated = res?.data || res;
                      if (updated) {
                        setUsers((prev) => prev.map((u) => {
                          const id = u._id || u.id;
                          const updatedId = updated._id || updated.id;
                          if (id === updatedId) return updated;
                          return u;
                        }));
                        toast({ title: 'User updated', description: `${updated.username || updated.email || 'User'} updated` });
                        setIsDialogOpen(false);
                      }
                    } catch (err) {
                      console.error(err);
                      toast({ title: 'Error', description: 'Failed to update user', variant: 'destructive' });
                    }
                  }}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Confirm Ban Alert */}
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Ban user</AlertDialogTitle>
                  <AlertDialogDescription>Are you sure you want to ban this user? This action can be reverted by an admin.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleBanUser(confirmTarget)}>Ban</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>
        </div>
      </div>
    </div>
  );
}
