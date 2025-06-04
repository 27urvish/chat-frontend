"use client"

import React, { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { z } from "zod"
import { signupSchema, SignupInput } from "../zod/userSchema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, UserPlus } from "lucide-react"

interface SignupFormProps {
  onSignup: (username: string) => void
}

export function SignupForm({ onSignup }: SignupFormProps) {
  const [formData, setFormData] = useState<SignupInput>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof SignupInput, string>>>({})

  const { mutate, isLoading }:any = useMutation({
    mutationFn: async () => {
      const res = await axios.post("https://chat-backend-nskn.onrender.com/api/sign-up", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      })
      return res.data
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token)
      onSignup(data._id || formData.username)
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err.message || "Signup failed"
      setError(msg)
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setFieldErrors({})
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})

    const result = signupSchema.safeParse(formData)

    if (!result.success) {
      const errors: Partial<Record<keyof SignupInput, string>> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof SignupInput
        errors[field] = err.message
      })
      setFieldErrors(errors)
      return
    }

    mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          disabled={isLoading}
        />
        {fieldErrors.username && <p className="text-sm text-red-500">{fieldErrors.username}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          disabled={isLoading}
        />
        {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {fieldErrors.password && <p className="text-sm text-red-500">{fieldErrors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          disabled={isLoading}
        />
        {fieldErrors.confirmPassword && (
          <p className="text-sm text-red-500">{fieldErrors.confirmPassword}</p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating account...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </div>
        )}
      </Button>
    </form>
  )
}
