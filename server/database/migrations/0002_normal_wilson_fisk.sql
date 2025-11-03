CREATE TABLE `AccountTokens` (
	`id` char(36) NOT NULL,
	`accountId` char(36) NOT NULL,
	`token` text NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`ip` varchar(255),
	`userAgent` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `AccountTokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Accounts` (
	`id` char(36) NOT NULL,
	`login` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `Accounts_login_unique` UNIQUE(`login`)
);
--> statement-breakpoint
CREATE TABLE `MortgageCalculation` (
	`id` char(36) NOT NULL,
	`userId` char(36) NOT NULL,
	`mortgageProfileId` char(36) NOT NULL,
	`monthlyPayment` decimal(15,2) NOT NULL,
	`totalPayment` decimal(15,2) NOT NULL,
	`totalOverpaymentAmount` decimal(15,2) NOT NULL,
	`possibleTaxDeduction` decimal(15,2) NOT NULL,
	`savingsDueMotherCapital` decimal(15,2) NOT NULL,
	`recommendedIncome` decimal(15,2) NOT NULL,
	`paymentSchedule` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `MortgageCalculation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `MortgageProfile` (
	`id` char(36) NOT NULL,
	`userId` char(36) NOT NULL,
	`propertyPrice` decimal(15,2) NOT NULL,
	`propertyType` varchar(100) NOT NULL,
	`downPaymentAmount` decimal(15,2) NOT NULL,
	`matCapitalAmount` decimal(15,2),
	`matCapitalIncluded` boolean NOT NULL DEFAULT false,
	`loanTermYears` int NOT NULL,
	`interestRate` decimal(5,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `MortgageProfile_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `RefreshTokens` (
	`id` char(36) NOT NULL,
	`token` text NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`ip` varchar(255),
	`userAgent` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `RefreshTokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Users` (
	`tgId` varchar(255) NOT NULL,
	`username` varchar(255),
	`firstName` varchar(255),
	`lastName` varchar(255),
	`langCode` varchar(10),
	`invitedBy` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Users_tgId` PRIMARY KEY(`tgId`)
);
