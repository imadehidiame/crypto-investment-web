// app/routes.ts
import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [

  layout('layouts/app-layout.tsx',[
    
    layout("layouts/index-layout.tsx", [
      index("routes/homee.tsx"), 
      route("about", "routes/index/about.tsx"),
      route("plans", "routes/index/plans.tsx"),
      route("auth", "routes/index/auth.tsx"),
      route("auth/signup", "routes/index/auth-signup.tsx"), 
      route("contact", "routes/index/contactt.tsx"),
      route("faq", "routes/index/faq.tsx"),
      route("testimonials", "routes/index/testimonials.tsx"),
      route("get-started", "routes/index/get-startedd.tsx"),
    ]),

    layout("layouts/dashboard-layoutt.tsx", [
      //index("routes/homee.tsx"), 
      route("dashboard", "routes/dashboard/dashboard-home.tsx"),
      route("dashboard/profile", "routes/dashboard/dashboard-profile.tsx"),
      route("dashboard/investments", "routes/dashboard/dashboard-investments.tsx"),
      route("dashboard/deposits", "routes/dashboard/dashboard-deposit.tsx"),
      route("dashboard/subscribe", "routes/dashboard/dashboard-subscribe.tsx"),
      route("dashboard/settings", "routes/dashboard/dashboard-settings.tsx"),
      route("dashboard/messages", "routes/dashboard/dashboard-messaging.tsx"),
      route("dashboard/transactions", "routes/dashboard/dashboard-transaction-history.tsx"),
      route("dashboard/withdrawal", "routes/dashboard/dashboard-withdrawal.tsx"),
      route("dashboard/withdrawal/request/:investment_id", "routes/dashboard/dashboard-withdrawal-item.tsx"),


      route("dashboard/adm", "routes/dashboard/adm/dashboard-home-adm.tsx"),
      route("dashboard/adm/profile", "routes/dashboard/adm/dashboard-profile-adm.tsx"),
      route("dashboard/adm/subscription-plans", "routes/dashboard/adm/dashboard-subscribe-adm.tsx"),
      route("dashboard/adm/deposits", "routes/dashboard/adm/dashboard-deposit-adm.tsx"),
      route("dashboard/adm/messaging", "routes/dashboard/adm/dashboard-messaging-adm.tsx"),
      route("dashboard/adm/transactions", "routes/dashboard/adm/dashboard-transaction-history-adm.tsx"),
      route("dashboard/adm/withdrawals", "routes/dashboard/adm/dashboard-withdrawal-adm.tsx"),

    ]),
    route("api/settings-update", "routes/api/settings-update.tsx"), 
    route("api/delete-wallet/:wallet", "routes/api/delete-wallet.tsx"),
    route("api/chat-messaging", "routes/api/chat-messaging.tsx"),  
    route("api/payment-callback/:userId/:paymentId",'routes/api/payment-callback.tsx'),
    route("api/adm/deposit",'routes/api/adm-deposit.tsx'),
  ]),
  
  
] satisfies RouteConfig;

