<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'role', 'avatar_url', 'created_at')
            ->withCount('assignedTasks')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Admin authorization required.'], 403);
        }

        $request->validate([
            'role' => 'required|in:admin,member',
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user,
        ]);
    }
}
