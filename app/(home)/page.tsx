"use client";
// React
import { Fragment, useMemo, useState } from "react";

// Components
import Header from "@shared/components/header";
import Footer from "@shared/components/footer";
import { Avatar, Button, Chip, Divider, Drawer } from "@mui/material";

// Services
import { getUsers } from "@shared/services/user.services";
import { getFunds } from "@shared/services/funds.services";

// Hooks
import { useQuery } from "@tanstack/react-query";

// Utils
import { formatCurrency, formatDate, formatDateWithTime } from "@shared/utils/formats.utils";

// Icons
import ClearIcon from '@mui/icons-material/Clear';
import AssignmentIcon from '@mui/icons-material/Assignment';

// Interfaces
import { User } from "@shared/interfaces/users.interfaces";
import { Fund } from "@shared/interfaces/funds.interfaces";
import { createSubscription, editSubscription, getSubscriptions } from "@shared/services/subsctiption.services";
import Swal from "sweetalert2";
import { getTransactions } from "@shared/services/transactions.service";
import { Loader } from "@shared/components/loader/loader";

const HomePage: React.FC = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);

  const { data: usersResponse, refetch: refetchUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  })

  const { data: fundsResponse, refetch: refetchFunds, isLoading: isLoadingFunds } = useQuery({
    queryKey: ["funds"],
    queryFn: () => getFunds(),
    enabled: !!selectedUser,
  })

  const { data: subscriptionsResponse, refetch: refetchSubscriptions } = useQuery({
    queryKey: ["subscriptions", selectedUser?.id ?? 0, selectedFund?.id ?? 0],
    queryFn: () => getSubscriptions(selectedUser?.id ?? 0, selectedFund?.id ?? 0),
    enabled: !!selectedUser && !!selectedFund,
  })

  const users = useMemo(() => usersResponse?.data?.data ?? [], [usersResponse])

  const funds = useMemo(() => fundsResponse?.data?.data ?? [], [fundsResponse])

  const subscription = useMemo(() => subscriptionsResponse?.data?.data[0] ?? null, [subscriptionsResponse])

  const { data: transactionsResponse, refetch: refetchTransactions } = useQuery({
    queryKey: ["transactions", selectedUser?.id ?? 0, selectedFund?.id ?? 0, subscription?.id ?? 0],
    queryFn: () => getTransactions(selectedUser?.id ?? 0, selectedFund?.id ?? 0),
    enabled: !!selectedUser && !!selectedFund && !!subscription,
  })

  const transactions = useMemo(() => {
    return transactionsResponse?.data?.data.sort((a, b) => b.id - a.id) ?? [];
  }, [transactionsResponse])

  const isDisabledCancelSubscription = useMemo(() => {
    if (!subscription) return true;
    return subscription.type === "CANCELLED";
  }, [subscription])

  const isDisabledConfirmSubscription = useMemo(() => {
    if (!selectedFund) return true;
    if (!selectedUser) return true;
    if (subscription && subscription.type === "ACTIVE") return true;
  }, [selectedFund, selectedUser, subscription])

  if (isLoadingUsers) return <Loader />
  
  if (usersResponse?.error) {
    return <div>Error</div>
  }

  const handleClickUser = (user: User) => {
    setSelectedUser(user);
    handleToggleDrawerOpen();
  }

  const handleCloseDrawer = () => {
    setSelectedUser(null);
    setSelectedFund(null);
    handleToggleDrawerOpen();
  }

  const handleToggleDrawerOpen = () => {
    setOpenDrawer(!openDrawer);
  }

  const handleClickFund = (fund: Fund) => {
    setSelectedFund(fund);
  }

  const handleRefetch = async () => {
    setTimeout(async () => {
      await refetchUsers();
      await refetchFunds();
      await refetchSubscriptions();
      await refetchTransactions();
    }, 100);
  }

  const handleConfirmSubscription = () => {
    setOpenDrawer(false);
    Swal.fire({
      title: "Confirm the amount",
      input: "number",
      inputAttributes: {
        min: String(selectedFund?.min_amount ?? 0),
      },
      inputValue: selectedFund?.min_amount ?? 0,
      showDenyButton: true,
      denyButtonText: "Cancel",
      confirmButtonText: "Confirm",
      inputValidator: (value) => {
        if (Number(value) < (selectedFund?.min_amount ?? 0)) {
          return `The amount must be at least ${selectedFund?.min_amount ?? 0}`;
        }
        if (Number(value) > (selectedUser?.balance ?? 0)) {
          return `There are no available funds to link to fund ${selectedFund?.name}`;
        }
        return null;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const action = subscription ? editSubscription(subscription?.id ?? 0, "ACTIVE", result.value) : createSubscription(selectedUser?.id ?? 0, selectedFund?.id ?? 0, result.value);

        action.then((response) => {
          if (response.error) {
            Swal.fire({
              title: "Error",
              text: response.error.message,
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Success",
              text: "Subscription successful",
              icon: "success",
            });
          }
        })
      }
      
      setOpenDrawer(true);
      await handleRefetch();
    })
  }

  const handleCancelSubscription = () => {
    setOpenDrawer(false);
    Swal.fire({
      title: "Are you sure?",
      text: "This will cancel your subscription",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, return",
    }).then(async (result) => {
      if (result.isConfirmed) {
        editSubscription(subscription?.id ?? 0, "CANCELLED").then((response) => {
          if (response.error) {
            Swal.fire({
              title: "Error",
              text: response.error.message,
              icon: "error",
            });
          } else {
            Swal.fire({
              title: "Success",
              text: "Subscription cancelled",
              icon: "success",
            });
          }
        })
      }
      
      setOpenDrawer(true);
      await handleRefetch();
    })
  }


  return (
    <Fragment>
      <Header />
      <main className="flex flex-col gap-4 flex-grow container mx-auto p-4">
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight leading-none text-center text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
          SELECT A USER
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <button key={user.id} className="flex items-center gap-4 p-4 rounded-4xl bg-blue-950 shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => handleClickUser(user)}>
              <Avatar>{user.name.charAt(0)}</Avatar>
              <span>
                <h4 title={user.name} className="text-xl font-bold text-left text-ellipsis line-clamp-1">{user.name}</h4>
                <p title={user.email} className="text-sm text-gray-500 text-left font-bold text-ellipsis line-clamp-1">{user.email}</p>
              </span>
              <span className="ml-auto">{formatCurrency(user.balance)}</span>
            </button>
          ))}
        </div>
      </main>
      <Footer />

      <Drawer 
        anchor="right" 
        open={openDrawer} 
        onClose={handleCloseDrawer}
        slotProps={{
          paper: {
            className: "flex flex-col gap-4 p-4 rounded-lg bg-gray-800! text-white! w-2xl",
          },
        }}
        ModalProps={{
          className: "z-[1000]!",
        }}>
          <header className="flex items-center justify-between">
            <h2 className="text-3xl font-bold uppercase">Founds</h2>
            <button className="cursor-pointer" onClick={handleCloseDrawer}>
              <ClearIcon />
            </button>
          </header>
          <Divider className="border-white!" />
          <section className="flex flex-col gap-4 h-full">
            <div className="flex flex-col gap-4 p-2 h-1/2 overflow-y-auto">
              {isLoadingFunds && <Loader />}
              {funds.length > 0 && funds.map((fund) => (
                <button key={fund.id} className="flex items-center gap-4 p-4 rounded-4xl shadow-md cursor-pointer bg-blue-950" onClick={() => handleClickFund(fund)}>
                  <Avatar>
                    <AssignmentIcon />
                  </Avatar>
                  <span>
                    <h4 title={fund.name} className="text-xl font-bold text-left text-ellipsis line-clamp-1">{fund.name}</h4>
                    <p title={fund.category} className="text-sm text-gray-500 text-left font-bold text-ellipsis line-clamp-1">{fund.category}</p>
                  </span>
                  <span className="ml-auto">{formatCurrency(fund.min_amount)}</span>
                </button>
              ))}
            </div>
            <Divider className="border-white!" />
            {selectedFund && (
              <div className="flex flex-col gap-4 h-1/2 overflow-y-auto">
                <header className="flex items-center justify-between gap-4 p-4">
                  <h3 className="text-xl font-bold text-center text-white">
                    {selectedFund.name} - {selectedFund.category}
                  </h3>
                  {subscription && (
                    <span className="flex flex-col items-center gap-4 text-sm text-white">
                      {subscription.type === "ACTIVE" && <Chip label="Active" color="success" size="small" />}
                      {subscription.type === "CANCELLED" && <Chip label="Cancelled" color="error" size="small" />}
                      <p>{subscription.type === "ACTIVE" ? formatDate(subscription.subscription_date) : formatDate(subscription.cancellation_date)}</p>
                    </span>
                  )}
                </header>              <Divider className="border-white!" />
                <div className="flex flex-col gap-4 p-4 overflow-y-auto">
                  <h3 className="text-lg font-bold text-white uppercase">Transaction history</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <p className="col-span-2">Date</p>
                    <p>Amount</p>
                    <p className="text-center">Type</p>
                  </div>
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="grid grid-cols-4 gap-4">
                      <p className="col-span-2">{formatDateWithTime(transaction.date)}</p>
                      <p>{formatCurrency(transaction.amount)}</p>
                      {transaction.type === "ACTIVE" && <Chip label="Active" color="success" size="small" />}
                      {transaction.type === "CANCELLED" && <Chip label="Cancelled" color="error" size="small" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedFund && (
              <footer className="flex items-center justify-between gap-4 h-fit flex-1">
                <Button variant="contained" color="error" size="large" className="w-full" disabled={isDisabledCancelSubscription} onClick={handleCancelSubscription}>
                  Cancel Subscription
                </Button>
                <Button variant="contained" color="success" size="large" className="w-full" disabled={isDisabledConfirmSubscription} onClick={handleConfirmSubscription}>
                  {subscription ? "Re subscribe" : "Subscribe"}
                </Button>
              </footer>
            )}
          </section>
      </Drawer>
    </Fragment>
  );
};

export default HomePage;
