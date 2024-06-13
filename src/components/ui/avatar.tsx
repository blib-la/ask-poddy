"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...properties }, reference) => (
	<AvatarPrimitive.Root
		ref={reference}
		className={cn(
			"relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-gray-400",
			className
		)}
		{...properties}
	/>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Image>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...properties }, reference) => (
	<AvatarPrimitive.Image
		ref={reference}
		className={cn("aspect-square h-full w-full", className)}
		{...properties}
	/>
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Fallback>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...properties }, reference) => (
	<AvatarPrimitive.Fallback
		ref={reference}
		className={cn(
			"flex h-full w-full items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800",
			className
		)}
		{...properties}
	/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
