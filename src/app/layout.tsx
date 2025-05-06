import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Users, Activity, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { FirebaseProvider } from '@/providers/firebase-provider';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { Button } from '@/components/ui/button';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VitalView Hub',
  description: 'Hospital Patient Management Backend',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <FirebaseProvider>
          <ReactQueryProvider>
            <SidebarProvider defaultOpen>
              <Sidebar>
                <SidebarHeader className="flex items-center justify-between">
                  <Link href="/" className="text-xl font-semibold flex items-center gap-2">
                     <Stethoscope className="text-primary" /> VitalView Hub
                  </Link>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Dashboard">
                        <Link href="/">
                          <Home />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Patients">
                        <Link href="/patients">
                          <Users />
                          <span>Patients</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                       <SidebarMenuButton asChild tooltip="AI Diagnosis">
                         <Link href="/ai-diagnosis">
                           <Activity />
                           <span>AI Diagnosis</span>
                         </Link>
                       </SidebarMenuButton>
                     </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                   {/* Add footer content if needed */}
                </SidebarFooter>
              </Sidebar>
              <SidebarInset className="p-4 md:p-6">
                 <div className="flex items-center justify-between mb-4 md:hidden">
                    <Link href="/" className="text-lg font-semibold flex items-center gap-2">
                      <Stethoscope className="text-primary" /> VitalView Hub
                    </Link>
                    <SidebarTrigger />
                  </div>
                {children}
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </ReactQueryProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
