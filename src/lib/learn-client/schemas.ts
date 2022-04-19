import Joi from 'joi'

import {
  VideoHostOption,
  EditionOption,
  HandsOnLabProviderOption,
  ProductOption,
  ThemeOption,
  CollectionLevelOption,
  CollectionCategoryOption,
  Tutorial,
  Collection,
  Product,
  ProductUsed,
  CollectionLite,
  TutorialLite,
  TutorialFullCollectionCtx,
} from './types'

/**
 * These schemas are used in testing to fully validate
 * the shape returned from client functions
 */

// Product
export const ProductSchema: Joi.ObjectSchema<Product> = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }), // uuid generated via github action
  slug: Joi.string()
    .required()
    .valid(...Object.values(ProductOption)),
  name: Joi.string().required(),
  docsUrl: Joi.string().required(),
  description: Joi.string().max(500),
})

// ProductUsed
export const ProductUsedSchema: Joi.ObjectSchema<ProductUsed> = Joi.object({
  product: ProductSchema.required(),
  tutorial: Joi.string().required(), // either uuid or string
  isBeta: Joi.boolean().required(),
  isPrimary: Joi.boolean().required(),
  minVersion: Joi.string(),
  maxVersion: Joi.string(),
})

// Collection Lite
export const CollectionLiteSchema: Joi.ObjectSchema<CollectionLite> =
  Joi.object({
    id: Joi.string().guid({
      version: ['uuidv4'],
    }), // uuid generated via github action
    slug: Joi.string().required(),
    name: Joi.string().required(),
    shortName: Joi.string().required(),
    theme: Joi.string()
      .required()
      .valid(...Object.values(ProductOption), ...Object.values(ThemeOption)),
    level: Joi.string()
      .valid(
        'advanced',
        'beginner',
        'get_started',
        'intermediate' as CollectionLevelOption
      )
      .required(),
  })

const BaseTutorialSchema = {
  id: Joi.string().guid({
    version: ['uuidv4'],
  }), // uuid generated via github action
  slug: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required().max(500),
  readTime: Joi.number().integer().required(),
  productsUsed: Joi.array().items(ProductUsedSchema),
  video: Joi.object({
    id: Joi.string().required(),
    videoHost: Joi.string()
      .valid(...Object.values(VideoHostOption))
      .required(),
    videoInline: Joi.boolean(),
  }),
  handsOnLab: Joi.object({
    id: Joi.string().required(),
    provider: Joi.string()
      .valid(...Object.values(HandsOnLabProviderOption))
      .required(),
  }),
  edition: Joi.string().valid(...Object.values(EditionOption)),
}

// TutorialLite
export const TutorialLiteSchema: Joi.ObjectSchema<TutorialLite> = Joi.object({
  ...BaseTutorialSchema,
  defaultContext: CollectionLiteSchema,
})

// Collection
export const CollectionSchema: Joi.ObjectSchema<Collection> = Joi.object({
  id: Joi.string().guid({
    version: ['uuidv4'],
  }), // uuid generated via github action
  slug: Joi.string().required(),
  name: Joi.string().required(),
  shortName: Joi.string().required(),
  description: Joi.string().required().max(500),
  theme: Joi.string()
    .required()
    .valid(...Object.values(ProductOption), ...Object.values(ThemeOption)),
  level: Joi.string()
    .valid(
      'advanced',
      'beginner',
      'get_started',
      'intermediate' as CollectionLevelOption
    )
    .required(),
  icon: Joi.string().required(),
  ordered: Joi.boolean().required(),
  tutorials: Joi.array().items(TutorialLiteSchema).required(),
  category: Joi.string().valid(...Object.keys(CollectionCategoryOption)),
})

// Tutorial
export const TutorialSchema: Joi.ObjectSchema<Tutorial> = Joi.object({
  ...BaseTutorialSchema,
  content: Joi.string().required(),
  collectionCtx: Joi.object({
    default: CollectionLiteSchema.required(),
    featuredIn: Joi.array().items(CollectionLiteSchema),
  }).required(),
})

export const TutorialSchemaFullCollectionCtx: Joi.ObjectSchema<TutorialFullCollectionCtx> =
  Joi.object({
    ...BaseTutorialSchema,
    content: Joi.string().required(),
    collectionCtx: Joi.object({
      default: CollectionLiteSchema.required(),
      featuredIn: Joi.array().items(CollectionSchema), // featured collection is full Colleciton (with tutorials)
    }).required(),
  })

// Page
// (specifically product pages, which are the only type of page we have so far)

const BrandedCalloutBlockSchema = Joi.object({
  type: Joi.string().required().valid('BrandedCallout'),
  product: Joi.string()
    .valid(...Object.values(ProductOption))
    .required(),
  heading: Joi.string().required(),
  subheading: Joi.string(),
  cta: Joi.object({
    text: Joi.string().required(),
    url: Joi.string().required(),
  }),
})

const LogoCardBlockSchema = Joi.object({
  type: Joi.string().required().valid('LogoCard'),
  logo: Joi.string()
    .valid(
      'docker',
      'github',
      'microsoft-azure',
      'oci',
      'google-cloud',
      'terraform-cloud',
      'aws'
    )
    .required(),
  collectionSlug: Joi.string().required(),
})

const CardListBlockSchema = Joi.object({
  items: Joi.array().items(LogoCardBlockSchema).required().min(1),
})

const TutorialsStackBlockSchema = Joi.object({
  type: Joi.string().required().valid('TutorialsStack'),
  product: Joi.string().valid(...Object.values(ProductOption)),
  heading: Joi.string(),
  subheading: Joi.string(),
  tutorialSlugs: Joi.array().items(Joi.string()).required().min(1),
})

const CollectionsStackBlockSchema = Joi.object({
  type: Joi.string().required().valid('CollectionsStack'),
  product: Joi.string().valid(...Object.values(ProductOption)),
  heading: Joi.string(),
  subheading: Joi.string(),
  collectionSlugs: Joi.array().items(Joi.string()).required().min(1),
})

const FeaturedStackBlockSchema = Joi.object({
  type: Joi.string().required().valid('FeaturedStack'),
  heading: Joi.string().required(),
  subheading: Joi.string(),
  // Note that FeaturedStackBlocks can only contain CardList blocks, for now.
  // We may want to switch to using "heading" & "subheading" blocks, rather
  // that this approach, which requires nesting arrays of blocks instead
  // having a single flat array (with the benefit of more controlled
  // styling of headings & subheadings in specific contexts).
  blocks: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().required().valid('CardList'),
      }).when(Joi.object({ type: 'CardList' }).unknown(), {
        then: CardListBlockSchema,
      })
    )
    .required()
    .min(1),
})

export const ProductPageSchema = Joi.object({
  slug: Joi.string()
    .valid(
      ...Object.values(ProductOption),
      ThemeOption.cloud,
      'well-architected-framework'
    )
    .required(),
  pageData: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    blocks: Joi.array()
      .items(
        Joi.object({
          type: Joi.string()
            .required()
            .valid(
              'BrandedCallout',
              'CardList',
              'CollectionsStack',
              'FeaturedStack',
              'TutorialsStack'
            ),
        })
          .when(Joi.object({ type: 'BrandedCallout' }).unknown(), {
            then: BrandedCalloutBlockSchema,
          })
          .when(Joi.object({ type: 'CardList' }).unknown(), {
            then: CardListBlockSchema,
          })
          .when(Joi.object({ type: 'CollectionsStack' }).unknown(), {
            then: CollectionsStackBlockSchema,
          })
          .when(Joi.object({ type: 'FeaturedStack' }).unknown(), {
            then: FeaturedStackBlockSchema,
          })
          .when(Joi.object({ type: 'TutorialsStack' }).unknown(), {
            then: TutorialsStackBlockSchema,
          })
      )
      .required(),
    showProductSitemap: Joi.boolean(),
    docsCta: Joi.object({
      heading: Joi.string().required(),
      subheading: Joi.string().required(),
      links: Joi.array().items(
        Joi.object({
          title: Joi.string(),
          url: Joi.string(),
        })
      ),
    }),
  }).required(),
})
