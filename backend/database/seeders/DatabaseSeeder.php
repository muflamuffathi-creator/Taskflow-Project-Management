<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Users
        $admin = User::create([
            'name' => 'Admin Manager',
            'email' => 'admin@taskmanager.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=AdminManager',
        ]);

        $john = User::create([
            'name' => 'John Doe',
            'email' => 'john@taskmanager.com',
            'password' => Hash::make('password123'),
            'role' => 'member',
            'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnDoe',
        ]);

        $jane = User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@taskmanager.com',
            'password' => Hash::make('password123'),
            'role' => 'member',
            'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=JaneSmith',
        ]);

        $alex = User::create([
            'name' => 'Alex Rivera',
            'email' => 'alex@taskmanager.com',
            'password' => Hash::make('password123'),
            'role' => 'member',
            'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera',
        ]);

        $sarah = User::create([
            'name' => 'Sarah Connor',
            'email' => 'sarah@taskmanager.com',
            'password' => Hash::make('password123'),
            'role' => 'member',
            'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahConnor',
        ]);

        // 2. Create Projects
        $proj1 = Project::create([
            'name' => 'Mobile Banking App v2.0',
            'code' => 'PRJ-BANK',
            'description' => 'Redesigning core iOS & Android mobile banking experience with biometric authentication and real-time alerts.',
            'status' => 'active',
            'owner_id' => $admin->id,
            'due_date' => Carbon::now()->addDays(30),
        ]);
        $proj1->members()->sync([$admin->id, $john->id, $jane->id]);

        $proj2 = Project::create([
            'name' => 'E-Commerce Replatforming',
            'code' => 'PRJ-SHOP',
            'description' => 'Migrating legacy storefront to microservices architecture, integrating Stripe payments and Redis caching.',
            'status' => 'active',
            'owner_id' => $admin->id,
            'due_date' => Carbon::now()->addDays(45),
        ]);
        $proj2->members()->sync([$admin->id, $alex->id, $jane->id]);

        $proj3 = Project::create([
            'name' => 'Q4 Global Marketing Campaign',
            'code' => 'PRJ-MKTG',
            'description' => 'Multi-channel marketing initiative including social media ads, landing pages, and email sequences.',
            'status' => 'planning',
            'owner_id' => $john->id,
            'due_date' => Carbon::now()->addDays(15),
        ]);
        $proj3->members()->sync([$john->id, $sarah->id, $jane->id]);

        // 3. Create Tasks for Project 1 (Mobile App)
        Task::create([
            'project_id' => $proj1->id,
            'title' => 'Implement Biometric Auth (FaceID & Fingerprint)',
            'description' => 'Integrate native iOS local authentication and Android BiometricPrompt APIs.',
            'status' => 'to-do',
            'priority' => 'urgent',
            'due_date' => Carbon::now()->addDays(5),
            'assigned_to' => $john->id,
            'created_by' => $admin->id,
            'position' => 1,
        ]);

        Task::create([
            'project_id' => $proj1->id,
            'title' => 'Design Dark Mode Color Tokens',
            'description' => 'Establish accessible HSL palette for high contrast dark UI theme.',
            'status' => 'to-do',
            'priority' => 'medium',
            'due_date' => Carbon::now()->addDays(7),
            'assigned_to' => $jane->id,
            'created_by' => $admin->id,
            'position' => 2,
        ]);

        Task::create([
            'project_id' => $proj1->id,
            'title' => 'Develop Real-Time Push Notification Engine',
            'description' => 'Connect Firebase Cloud Messaging with Laravel event listeners.',
            'status' => 'in_progress',
            'priority' => 'high',
            'due_date' => Carbon::now()->addDays(3),
            'assigned_to' => $john->id,
            'created_by' => $admin->id,
            'position' => 1,
        ]);

        Task::create([
            'project_id' => $proj1->id,
            'title' => 'Audit REST API Endpoints for Security Vulnerabilities',
            'description' => 'Perform penetration testing and audit Sanctum token scopes.',
            'status' => 'review',
            'priority' => 'urgent',
            'due_date' => Carbon::now()->addDays(2),
            'assigned_to' => $admin->id,
            'created_by' => $admin->id,
            'position' => 1,
        ]);

        Task::create([
            'project_id' => $proj1->id,
            'title' => 'Setup Initial Laravel & MySQL Database Architecture',
            'description' => 'Configure database migrations, seeders, and Sanctum tokens.',
            'status' => 'done',
            'priority' => 'high',
            'due_date' => Carbon::now()->subDays(2),
            'assigned_to' => $admin->id,
            'created_by' => $admin->id,
            'position' => 1,
        ]);

        Task::create([
            'project_id' => $proj1->id,
            'title' => 'Design Figma UI Wireframes for Kanban Board',
            'description' => 'Finalize drag-and-drop cards and column layouts in Figma.',
            'status' => 'done',
            'priority' => 'medium',
            'due_date' => Carbon::now()->subDays(4),
            'assigned_to' => $jane->id,
            'created_by' => $admin->id,
            'position' => 2,
        ]);

        // 4. Create Tasks for Project 2 (E-Commerce)
        Task::create([
            'project_id' => $proj2->id,
            'title' => 'Setup Redis Cache Cluster for Product Catalog',
            'description' => 'Configure Redis memory limits and cache key invalidation tags.',
            'status' => 'to-do',
            'priority' => 'high',
            'due_date' => Carbon::now()->addDays(10),
            'assigned_to' => $alex->id,
            'created_by' => $admin->id,
            'position' => 1,
        ]);

        Task::create([
            'project_id' => $proj2->id,
            'title' => 'Integrate Stripe Payment Gateway API',
            'description' => 'Implement payment intents, webhook handlers, and refund workflows.',
            'status' => 'in_progress',
            'priority' => 'urgent',
            'due_date' => Carbon::now()->addDays(4),
            'assigned_to' => $alex->id,
            'created_by' => $admin->id,
            'position' => 1,
        ]);

        Task::create([
            'project_id' => $proj2->id,
            'title' => 'Optimize SQL Queries for Inventory Search',
            'description' => 'Add full-text indexes and optimize JOINs on product variants table.',
            'status' => 'in_progress',
            'priority' => 'medium',
            'due_date' => Carbon::now()->addDays(6),
            'assigned_to' => $jane->id,
            'created_by' => $admin->id,
            'position' => 2,
        ]);

        Task::create([
            'project_id' => $proj2->id,
            'title' => 'Refactor Checkout Flow Component',
            'description' => 'Rebuild multi-step checkout form in React with validation.',
            'status' => 'review',
            'priority' => 'high',
            'due_date' => Carbon::now()->addDays(1),
            'assigned_to' => $alex->id,
            'created_by' => $admin->id,
            'position' => 1,
        ]);

        Task::create([
            'project_id' => $proj2->id,
            'title' => 'Configure CI/CD Deployment Pipeline',
            'description' => 'Setup GitHub Actions workflow for automated unit tests and build deployment.',
            'status' => 'done',
            'priority' => 'high',
            'due_date' => Carbon::now()->subDays(1),
            'assigned_to' => $alex->id,
            'created_by' => $admin->id,
            'position' => 1,
        ]);

        // 5. Create Tasks for Project 3 (Marketing)
        Task::create([
            'project_id' => $proj3->id,
            'title' => 'Draft Social Media Copy for Product Launch',
            'description' => 'Prepare Twitter threads, LinkedIn announcements, and Instagram banners.',
            'status' => 'to-do',
            'priority' => 'low',
            'due_date' => Carbon::now()->addDays(8),
            'assigned_to' => $sarah->id,
            'created_by' => $john->id,
            'position' => 1,
        ]);

        Task::create([
            'project_id' => $proj3->id,
            'title' => 'Create Landing Page Lead Capture Form',
            'description' => 'Build reactive newsletter subscription form with spam protection.',
            'status' => 'in_progress',
            'priority' => 'medium',
            'due_date' => Carbon::now()->addDays(3),
            'assigned_to' => $sarah->id,
            'created_by' => $john->id,
            'position' => 1,
        ]);

        Task::create([
            'project_id' => $proj3->id,
            'title' => 'Produce Video Teaser Trailer',
            'description' => 'Edit 30-second motion graphics trailer for campaign launch.',
            'status' => 'review',
            'priority' => 'high',
            'due_date' => Carbon::now()->addDays(2),
            'assigned_to' => $sarah->id,
            'created_by' => $john->id,
            'position' => 1,
        ]);

        Task::create([
            'project_id' => $proj3->id,
            'title' => 'Setup Google Analytics 4 Event Tracking',
            'description' => 'Configure custom event dimensions for CTA button clicks.',
            'status' => 'done',
            'priority' => 'low',
            'due_date' => Carbon::now()->subDays(3),
            'assigned_to' => $sarah->id,
            'created_by' => $john->id,
            'position' => 1,
        ]);
    }
}
