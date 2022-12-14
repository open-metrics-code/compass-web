import React from 'react';
import {
  useCreateProjectTaskMutation,
  useCreateRepoTaskMutation,
} from '@graphql/generated';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import classnames from 'classnames';
import { useSession } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers';
import { ClientSafeProvider, LiteralUnion } from 'next-auth/react/types';
import client from '@graphql/client';
import SuccessMessage from './SuccessMessage';
import ErrorMessage from './ErrorMessage';
import InputFieldArray from './InputFieldArray';
import SelectField from './SelectField';
import Auth from './Auth';
import { CreateFields } from './type';

export const getUrlReg = (provider: string) =>
  new RegExp(`^https:\/\/${provider}\.com\/.+\/.+`, 'i');

const AnalyzeCreate: React.FC<{
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
}> = ({ providers }) => {
  const session = useSession();
  const isLogin = Boolean(session?.data);
  const provider = session?.data?.provider || 'github';

  const {
    isLoading: isRepoTaskLoading,
    isSuccess: repoTaskSuccess,
    isError: repoTaskError,
    mutate: mutateRepo,
    data: repoTaskData,
  } = useCreateRepoTaskMutation(client);
  const {
    isLoading: loadingProject,
    isSuccess: successProject,
    isError: errorProject,
    mutate: mutateProject,
    data: projectTaskData,
  } = useCreateProjectTaskMutation(client);

  const methods = useForm<CreateFields>({
    defaultValues: {
      softwareArtifactProjects: [{ value: '' }],
      communityProject: [{ value: '' }],
    },
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<CreateFields> = async (data) => {
    const { projectName, softwareArtifactProjects, communityProject } = data;
    const repoUrls = softwareArtifactProjects
      .map((item) => item.value.trim())
      .filter(Boolean);
    const comRepoUrls = communityProject
      .map((item) => item.value.trim())
      .filter(Boolean);

    const common = {
      username: session!.data!.user!.login as string,
      token: session!.data!.accessToken as string,
      origin: session!.data!.provider as string,
    };

    if (repoUrls.length == 1 && comRepoUrls.length == 0) {
      mutateRepo({
        ...common,
        repoUrl: repoUrls[0],
      });
      return;
    }

    if (repoUrls.length >= 2 || comRepoUrls.length >= 1) {
      mutateProject({
        ...common,
        projectTypes: [
          { type: 'software-artifact-projects', repoList: repoUrls },
          { type: 'community-projects', repoList: comRepoUrls },
        ],
        projectName,
      });
    }
  };

  return (
    <>
      <div className="h-40 bg-[#2c5fea]"></div>
      <div className="mx-auto w-[1000px] md:w-full">
        <div className="w-[560px] pb-10 pt-10 md:w-full md:px-4">
          <Auth providers={providers} />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputFieldArray
                label="Software Artifact Projects"
                name="softwareArtifactProjects"
                registerOptions={{
                  required: 'this is required',
                  pattern: {
                    value: getUrlReg(provider!),
                    message: `must be a ${provider} repo url`,
                  },
                }}
              />
              <InputFieldArray
                label="Comminuty Repository"
                name="communityProject"
                registerOptions={{
                  pattern: {
                    value: getUrlReg(provider!),
                    message: `must be a ${provider} repo url`,
                  },
                }}
              />
              <SelectField
                label="Project Name"
                name="projectName"
                registerOptions={{
                  required: 'this is required',
                }}
              />
              <button
                type="submit"
                disabled={!isLogin}
                className={classnames(
                  'daisy-btn h-12 w-32 rounded-none bg-black text-white',
                  {
                    ['daisy-loading']: isRepoTaskLoading || loadingProject,
                    ['daisy-btn-disabled']: !isLogin,
                    ['bg-gray-400']: !isLogin,
                  }
                )}
              >
                {isLogin ? 'Submit' : 'Please Login'}
              </button>
            </form>

            {(repoTaskError || errorProject) && <ErrorMessage />}
            {(repoTaskSuccess || successProject) && (
              <SuccessMessage
                url={
                  repoTaskData?.createRepoTask?.prUrl! ||
                  projectTaskData?.createProjectTask?.prUrl!
                }
              />
            )}
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default AnalyzeCreate;
