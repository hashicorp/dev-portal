/**
 * Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: MPL-2.0
 */

export interface CertificationCardProps {
    /* 
        Name of the HashiCorp associated product
        (e.g. "terraform", "vault", "consul", etc.)
    */
    product: string;

    /* 
        Exam title displayed at the top of the certification card
    */
    title: string;

    /* 
        Optional Exam description displayed below the title on the certification card
    */
    desc?: string;

    /* 
        Optional number of stars to represent difficulty for the certification
    */
    starCount?: number;

    /* 
        Optional call to action text on the bottom of the certification card
        Default value is "Learn more"
    */
    cta?: string;

    /* 
        Link for the call to action - This redirects to the desired Certification Exam Page
    */
    ctaLink: string;

    /*
        Optional array of certification details to display on the certification card
        (e.g. version tested, concepts & skills, value proposition, etc.)
    */
    certDetails?: string[];

    /* 
        Optional boolean to determine if the certification card should be displayed in a reduced format
        Default value is false
    */
    isReduced?: boolean;
}