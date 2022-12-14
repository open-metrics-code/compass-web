import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import Link from 'next/link';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import Empty from '@common/components/Empty';
import useDropDown from '@common/hooks/useDropDown';
import { SearchQuery } from '@graphql/generated';
import { removeHttps } from '@common/utils';

const DropDownList: React.FC<{ result: SearchQuery['fuzzySearch'] }> = ({
  result,
}) => {
  const router = useRouter();
  const { active } = useDropDown({
    totalLength: result.length,
    onPressEnter: () => {
      const activeItem = result[active];
      router.push(
        `/analyze?${activeItem.level}=${encodeURIComponent(activeItem.label!)}`
      );
    },
  });

  return (
    <>
      {result.map((item, index) => {
        return (
          <Link
            href={`/analyze?${item.level}=${encodeURIComponent(item.label!)}`}
            key={item.label}
          >
            <a
              className={classnames(
                { 'bg-gray-100': active === index },
                'flex px-4 py-3 text-xl hover:bg-gray-100',
                'md:py-2 md:px-2 md:text-base'
              )}
            >
              <span
                className={classnames(
                  'mr-2 rounded bg-gray-200 p-1 text-base leading-none text-gray-400',
                  'md:text-sm'
                )}
              >
                {item.level}
              </span>
              <span className="line-clamp-1">{removeHttps(item.label!)}</span>
            </a>
          </Link>
        );
      })}
    </>
  );
};

const SearchDropdown: React.FC<{
  result: SearchQuery['fuzzySearch'];
}> = ({ result }) => {
  if (!result) return <Empty type="DropDownItem" />;
  if (Array.isArray(result) && result.length === 0) {
    return (
      <p className="block px-4 py-3 text-lg text-gray-400 md:py-2 md:text-base">
        {'No result! '}
        <Link href="/analyze/create">
          <a className="text-primary">submit an analysis request</a>
        </Link>
      </p>
    );
  }

  return <DropDownList result={result!} />;
};

export default SearchDropdown;
