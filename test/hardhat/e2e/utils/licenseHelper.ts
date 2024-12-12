// Purpose: Helper functions for licensing config and registering PIL terms functions

import hre from "hardhat";
import { EvenSplitGroupPool, MockERC20, PILicenseTemplate } from "../constants";
import { terms } from "../licenseTermsTemplate";

export const LicensingConfig = ({
  isSet: true,
  mintingFee: 20,
  licensingHook: hre.ethers.ZeroAddress,
  hookData: "0x",
  commercialRevShare: 10 * 10 ** 6,
  disabled: false,
  expectMinimumGroupRewardShare: 0,
  expectGroupRewardPool: EvenSplitGroupPool,
});

export async function registerPILTerms(
  commercialUse: boolean = false,
  mintingFee: number = 0,
  commercialRevShare: number = 0,
  royaltyPolicy: string = hre.ethers.ZeroAddress,
  currencyToken: string = MockERC20): Promise<number> {
  
  const licenseTemplate = await hre.ethers.getContractAt("PILicenseTemplate", PILicenseTemplate);

  const testTerms = terms;
  testTerms.royaltyPolicy = royaltyPolicy;
  testTerms.defaultMintingFee = mintingFee;
  testTerms.commercialUse = commercialUse;
  testTerms.commercialRevShare = commercialRevShare;
  testTerms.currency = currencyToken;

  await licenseTemplate.registerLicenseTerms(testTerms).then((tx) => tx.wait());
  const licenseTermsId = await licenseTemplate.getLicenseTermsId(testTerms);
  console.log("licenseTermsId", licenseTermsId);

  return licenseTermsId;
}