import React from 'react';
import Link from 'next/link';
import Logo from '@components/Logo';
import { Center } from '@components/BaseLayout';

const linkData = [
  {
    title: 'Solutions1',
    links: [
      { text: 'Link1', href: '' },
      { text: 'Link2', href: '' },
    ],
  },
  {
    title: 'Solutions2',
    links: [
      { text: 'Link1', href: '' },
      { text: 'Link2', href: '' },
    ],
  },
  {
    title: 'Solutions3',
    links: [
      { text: 'Link1', href: '' },
      { text: 'Link2', href: '' },
    ],
  },
  {
    title: 'Solutions4',
    links: [
      { text: 'Link1', href: '' },
      { text: 'Link2', href: '' },
    ],
  },
];

const FooterLinks = () => {
  return (
    <Center>
      <div className="flex w-full flex-wrap justify-around pt-20 pb-16">
        <Logo />
        {linkData.map((item) => {
          return (
            <div
              className="mr-12 ml-12 mb-4 flex w-44 flex-col "
              key={item.title}
            >
              <h3 className="mb-4 text-sm font-bold">Solutions</h3>
              {item.links.map((link) => {
                return (
                  <Link href={link.href} key={link.text}>
                    <a className="mb-2 text-sm text-gray-500">{link.text}</a>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </Center>
  );
};

export default FooterLinks;