"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_API === "true"
const MOCK_EMPRESA_ID = "11111111-1111-1111-1111-111111111111"

const schema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
  empresaId: z.string().uuid("ID de empresa inválido"),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard"
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      empresaId: MOCK_MODE ? MOCK_EMPRESA_ID : "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      empresaId: data.empresaId,
      redirect: false,
    })

    if (result?.error) {
      setServerError("Correo, contraseña o empresa incorrectos.")
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {MOCK_MODE && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          Modo demo — ingresa cualquier correo y contraseña.
        </div>
      )}

      {serverError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {serverError}
        </div>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="usuario@empresa.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {!MOCK_MODE && (
        <div className="space-y-1">
          <Label htmlFor="empresaId">ID de empresa</Label>
          <Input
            id="empresaId"
            type="text"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            {...register("empresaId")}
          />
          {errors.empresaId && (
            <p className="text-xs text-red-600">{errors.empresaId.message}</p>
          )}
        </div>
      )}

      {/* Hidden field carries the empresaId in mock mode */}
      {MOCK_MODE && <input type="hidden" {...register("empresaId")} />}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  )
}
