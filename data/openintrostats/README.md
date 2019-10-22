# Figure 1.1

a CSV of 451 patients measured at two time points for a total of 902 observations with 4 columns: 

* patient_number: the patient id (451 patients, measured twice)
* group: either treatment or control
* days: measurement taken at 30 days or 365 days
* outcome: either stroke or no event.

#### Source
Chimowitz MI, Lynn MJ, Derdeyn CP, et al. 2011. Stenting versus Aggressive Medical Therapy for Intracranial
Arterial Stenosis. New England Journal of Medicine 365:993-1003. www.nejm.org/doi/full/10.1056/NEJMoa1105335 via https://www.openintro.org/stat/textbook.php?stat_book=aps

# Loan50

50 rows and 7 columns; 50 randomly sampled loans offered through the Lending Club 

* loan_amount: Amount of the loan received, in US dollars.
* interest_rate: Interest rate on the loan, in an annual percentage
* term: The length of the loan, which is always set as a whole number of months
* grade: Loan grade, which takes values A through G and represents the quality of the loan and its likelihood of being repaid
* state: US state where the borrower resides
* total_income: Borrower’s total income, including any second income, in US dollars
* homeownership: Indicates whether the person owns, owns but has a mortgage, or rents

#### Source
https://github.com/OpenIntroStat/openintro-r-package/blob/master/data/loan50.rda