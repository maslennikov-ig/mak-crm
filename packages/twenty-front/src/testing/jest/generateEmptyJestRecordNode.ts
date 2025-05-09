import { getRecordNodeFromRecord } from '@/object-record/cache/utils/getRecordNodeFromRecord';
import { generateDepthOneRecordGqlFields } from '@/object-record/graphql/utils/generateDepthOneRecordGqlFields';
import { prefillRecord } from '@/object-record/utils/prefillRecord';
import { generatedMockObjectMetadataItems } from '~/testing/mock-data/generatedMockObjectMetadataItems';

type GenerateEmptyJestRecordNodeArgs = {
  objectNameSingular: string;
  input: Record<string, unknown>;
  withDepthOneRelation?: boolean;
};
export const generateEmptyJestRecordNode = ({
  objectNameSingular,
  input,
  withDepthOneRelation = false,
}: GenerateEmptyJestRecordNodeArgs) => {
  const objectMetadataItem = generatedMockObjectMetadataItems.find(
    (item) => item.nameSingular === objectNameSingular,
  );

  if (!objectMetadataItem) {
    throw new Error(
      `ObjectMetadataItem not found for objectNameSingular: ${objectNameSingular} while generating empty Jest record node`,
    );
  }

  const prefilledRecord = prefillRecord({
    objectMetadataItem,
    input,
  });

  return getRecordNodeFromRecord({
    record: prefilledRecord,
    objectMetadataItem,
    objectMetadataItems: generatedMockObjectMetadataItems,
    recordGqlFields: withDepthOneRelation
      ? generateDepthOneRecordGqlFields({
          objectMetadataItem,
        })
      : undefined,
  });
};
