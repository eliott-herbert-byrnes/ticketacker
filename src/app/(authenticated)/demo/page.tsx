import {
  CheckCircle2,
  Clock,
  CreditCard,
  Filter,
  Mail,
  MessageSquare,
  Paperclip,
  Search,
  Shield,
  Ticket,
  Users,
  Zap,
} from "lucide-react";
import { redirect } from "next/navigation";
import { signInPath } from "@/app/paths";
import { Heading } from "@/components/Heading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuth } from "@/features/auth/queries/get-auth";

const DemoPage = async () => {
  const { user } = await getAuth();

  if (!user) {
    redirect(signInPath());
  }

  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading
        title="Welcome to TickeTacker"
        description="Explore the features and capabilities of your modern ticketing platform"
      />
      <div className="w-full max-w-[1000px] mx-auto p-0 sm:p-10">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="organization">Organisation</TabsTrigger>
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What is TickeTacker?</CardTitle>
                <CardDescription>
                  A modern, full-stack SaaS ticketing platform for collaborative
                  teams
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-5/6">

                <p className="text-sm">
                  TickeTacker is a production-ready ticketing and project
                  management platform.
                  It provides enterprise-grade architecture including
                  multi-tenancy, subscription billing, real-time collaboration,
                  and secure file storage—everything your team needs to track
                  issues, manage projects, and collaborate effectively.
                </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex gap-3">
                    <Ticket className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Ticket Management</h4>
                      <p className="text-xs text-muted-foreground">
                        Create, search, filter, and manage tickets with full
                        lifecycle tracking
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Threaded Discussions
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Comment system with markdown formatting and real-time
                        updates
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Paperclip className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Secure File Attachments
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        AWS S3 storage with presigned URLs for temporary secure
                        access
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Users className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Multi-Tenant Organisations
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Role-based access control with invitation workflows
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Why TickeTacker?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    💰 Affordable & Transparent
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Free tier for small teams, with transparent subscription
                    tiers. No per-user pricing traps or hidden fees—built for
                    startups and growing teams.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    🚀 Modern Technology Stack
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Built with Next.js 15, React 19, TypeScript, Prisma, and
                    Stripe. Cutting-edge architecture ensuring long-term
                    maintainability and performance.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    🔒 Security & Privacy First
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Self-contained authentication, encrypted file storage, audit
                    logs for compliance. Your data stays secure with industry
                    best practices.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">⚡ Fast & Responsive</h4>
                  <p className="text-sm text-muted-foreground">
                    Server-side rendering, optimistic updates, efficient
                    caching. Built for speed with a beautiful, accessible
                    interface that works everywhere.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FEATURES TAB */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Core Features</CardTitle>
                <CardDescription>
                  Everything you need for comprehensive ticket management
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ticket className="h-5 w-5 text-blue-500" />
                    <h3 className="font-semibold text-base">
                      Comprehensive Ticket Management
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Full lifecycle ticket tracking with powerful management
                    capabilities:
                  </p>
                  <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                    <li>Create, edit, archive, and delete tickets</li>
                    <li>
                      Custom fields for priority, status, category, and
                      assignees
                    </li>
                    <li>Rich text descriptions with markdown support</li>
                    <li>
                      Ticket references and linking for relationship mapping
                    </li>
                    <li>Full-text search with advanced filtering</li>
                    <li>Sort by date, priority, or last updated</li>
                    <li>Configurable pagination for large datasets</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold text-base">
                      Threaded Discussions
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Collaborate effectively with a full-featured comment system.
                    Support for markdown formatting, @mentions for user
                    notifications, reply threading for organised conversations,
                    and real-time updates. Edit and delete permissions based on
                    authorship with complete comment history and audit trails.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Paperclip className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold text-base">
                      Secure File Attachments
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Drag-and-drop file upload interface with AWS S3 storage.
                    Organisation-namespaced buckets ensure data isolation.
                    Presigned URLs provide temporary secure access without
                    exposing files publicly. Automatic file type validation,
                    size limits, and thumbnail generation for images.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    <h3 className="font-semibold text-base">
                      Multi-Tenant Organisations
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create and manage multiple organisations per user.
                    Organisation switching without re-authentication, custom
                    branding per organisation (logos, colours), and complete
                    data isolation ensuring privacy between tenants. Flexible
                    organisation transfer and ownership management capabilities.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold text-base">
                      Subscription & Billing
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Multiple pricing tiers (Free, Professional, Enterprise)
                    powered by Stripe. Secure checkout, subscription management
                    dashboard, automatic billing and invoicing. Usage-based
                    limits per tier with upgrade/downgrade flows and prorated
                    billing.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-base">Email Workflows</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Professional email workflows for all key events: welcome
                    emails with onboarding steps, email verification with secure
                    tokens, password reset flows, invitation emails with
                    organisation context, ticket notification digests, and
                    billing confirmations. All templates built with React Email
                    for consistency.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-indigo-500" />
                    <h3 className="font-semibold text-base">
                      Background Processing
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Asynchronous job queue powered by Inngest. Scheduled digest
                    emails (daily, weekly), automated cleanup of expired
                    resources, bulk import/export operations, analytics
                    aggregation, and webhook delivery with automatic retry
                    logic.
                  </p>
                </div>

                <div className="border-l-4 border-teal-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-teal-500" />
                    <h3 className="font-semibold text-base">
                      Security & Authentication
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Passwords hashed with Argon2, JWT session strategy with
                    NextAuth.js, presigned URLs that are scoped and short-lived,
                    role-based access control (Owner, Admin, Member, Guest), and
                    email verification workflows to ensure account security.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <Search className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Full-Text Search</h4>
                      <p className="text-xs text-muted-foreground">
                        Powerful search across ticket titles, descriptions, and
                        comments
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Filter className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        Advanced Filtering
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Filter by status, priority, assignee, date ranges, and
                        more
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Real-Time Updates</h4>
                      <p className="text-xs text-muted-foreground">
                        Optimistic UI updates with instant feedback
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Responsive Design</h4>
                      <p className="text-xs text-muted-foreground">
                        Beautiful interface on mobile, tablet, and desktop
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ORGANIZATION TAB */}
          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organisation Structure</CardTitle>
                <CardDescription>
                  How TickeTacker organises your teams and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                  <div className="space-y-3 font-mono text-sm">
                    <div>🏢 Organisation (Your Company)</div>
                    <div className="ml-6">
                      ├─ 👥 Members (with assigned roles)
                    </div>
                    <div className="ml-6">
                      ├─ 🎫 Tickets (organisation-scoped)
                    </div>
                    <div className="ml-12">
                      ├─ 💬 Comments (threaded discussions)
                    </div>
                    <div className="ml-12">└─ 📎 Attachments (S3 storage)</div>
                    <div className="ml-6">
                      ├─ 💳 Subscription (Stripe integration)
                    </div>
                    <div className="ml-6">
                      └─ ✉️ Invitations (pending & accepted)
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  Each organisation is completely isolated with its own data,
                  members, and subscription. Users can belong to multiple
                  organisations and switch between them seamlessly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Roles & Permissions</CardTitle>
                <CardDescription>
                  Role-based access control for secure collaboration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600">Owner</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground ml-0">
                    Full access to all features. Can manage subscriptions,
                    transfer organisation ownership, invite and remove users,
                    manage all tickets and settings, and access billing
                    information.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Admin</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can manage tickets, invite users, moderate comments, manage
                    attachments, and configure organisation settings. Cannot
                    manage billing or transfer ownership.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Member</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can create and edit their own tickets, comment on all
                    tickets, upload attachments, and view organisation members.
                    Standard user role for most team members.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Guest</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Read-only access. Can view tickets and comments but cannot
                    create or modify content. Ideal for external stakeholders or
                    observers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invitation System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  TickeTacker uses an email-based invitation system to onboard
                  new team members securely:
                </p>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">1. Send Invitation</h4>
                  <p className="text-sm text-muted-foreground">
                    Owners and Admins can invite users by email address and
                    assign an initial role.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">2. Email Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    The invitee receives a professionally formatted email with
                    organisation context and a secure invitation link.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">3. Account Creation</h4>
                  <p className="text-sm text-muted-foreground">
                    New users create their account through the invitation link,
                    automatically joining the organisation with the assigned
                    role.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">4. Manage Invitations</h4>
                  <p className="text-sm text-muted-foreground">
                    Track pending invitations, resend emails if needed, or
                    revoke invitations that are no longer required.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Tenancy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Users can belong to multiple organisations simultaneously:
                </p>
                <ul className="text-sm space-y-2 ml-4 list-disc text-muted-foreground">
                  <li>Switch between organisations without signing out</li>
                  <li>Different roles in different organisations</li>
                  <li>Complete data isolation between organisations</li>
                  <li>Organisation-specific settings and branding</li>
                  <li>Separate subscription tiers per organisation</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GETTING STARTED TAB */}
          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Guide</CardTitle>
                <CardDescription>
                  Get up and running with TickeTacker in minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs">
                      1
                    </span>
                    Create Your First Ticket
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Navigate to the Tickets page and click &quot;Create
                    Ticket&quot;. Add a title, description, priority, and any
                    relevant details to get started.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs">
                      2
                    </span>
                    Add Comments & Collaborate
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Open any ticket and scroll to the comments section. Use
                    markdown formatting to add rich text, code blocks, and
                    @mentions to notify team members.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-xs">
                      3
                    </span>
                    Attach Files
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Drag and drop files onto tickets or comments. Files are
                    securely stored in AWS S3 and accessible only to
                    organisation members.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-600 text-white text-xs">
                      4
                    </span>
                    Invite Team Members
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Go to Organisation settings and use the Invite feature to
                    add team members. Assign appropriate roles based on their
                    responsibilities.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs">
                      5
                    </span>
                    Organise with Filters
                  </h4>
                  <p className="text-sm text-muted-foreground ml-8">
                    Use the search bar and filters to find tickets by status,
                    priority, assignee, or date. Save time with powerful sorting
                    and pagination options.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    ✅ Use Descriptive Titles
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Clear, specific ticket titles make searching and filtering
                    more effective. Include key context like &quot;[Bug] Login
                    button not working on mobile&quot;.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    🏷️ Set Priorities Consistently
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Establish team guidelines for priority levels. Reserve
                    &quot;Critical&quot; for true emergencies to maintain
                    meaningful prioritisation.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    💬 Keep Discussions in Comments
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Use ticket comments for all related discussions. This
                    creates a complete audit trail and keeps everyone informed
                    in one place.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    📎 Attach Supporting Files
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Add screenshots, logs, or documents to provide context.
                    Visual evidence speeds up resolution and reduces
                    back-and-forth communication.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">
                    🔍 Use Search Effectively
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The search function looks through titles, descriptions, and
                    comments. Combine search with filters for precise results.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you encounter any issues or have questions about using
                  TickeTacker:
                </p>
                <ul className="text-sm space-y-2 ml-4 list-disc text-muted-foreground">
                  <li>
                    Check the documentation at{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      github.com/yourusername/ticketacker
                    </code>
                  </li>
                  <li>Create a support ticket within the application</li>
                  <li>Contact your organisation administrator</li>
                  <li>Review this demo page for feature overviews</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DemoPage;
