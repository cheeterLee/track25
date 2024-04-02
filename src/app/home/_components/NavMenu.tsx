'use client';

import * as React from 'react';
import Link from 'next/link';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuIndicator,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export default function NavMenu() {
    return (
        <NavigationMenu className='hidden md:block'>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <Link href='/home' legacyBehavior passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            Home
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href='/home/about' legacyBehavior passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            About
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href='/home/pricing' legacyBehavior passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            Pricing
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link href='/home/showcase' legacyBehavior passHref>
                        <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                        >
                            Showcase
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuIndicator />
            </NavigationMenuList>
        </NavigationMenu>
    );
}
