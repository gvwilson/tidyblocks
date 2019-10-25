# Figure 1.1

a CSV of 451 patients measured at two time points for a total of 902 observations with 4 columns: 

* **patient_number:** the patient id (451 patients, measured twice)
* **group:** either treatment or control
* **days:** measurement taken at 30 days or 365 days
* **outcome:** either stroke or no event.

#### Source
Chimowitz MI, Lynn MJ, Derdeyn CP, et al. 2011. Stenting versus Aggressive Medical Therapy for Intracranial
Arterial Stenosis. New England Journal of Medicine 365:993-1003. www.nejm.org/doi/full/10.1056/NEJMoa1105335 via https://www.openintro.org/stat/textbook.php?stat_book=aps

# Loan50

50 rows and 7 columns; 50 randomly sampled loans offered through the Lending Club 

* **loan_amount:** Amount of the loan received, in US dollars.
* **interest_rate:** Interest rate on the loan, in an annual percentage
* **term:** The length of the loan, which is always set as a whole number of months
* **grade:** Loan grade, which takes values A through G and represents the quality of the loan and its likelihood of being repaid
* **state:** US state where the borrower resides
* **total_income:** Borrower’s total income, including any second income, in US dollars
* **homeownership:** Indicates whether the person owns, owns but has a mortgage, or rents

#### Source
https://github.com/OpenIntroStat/openintro-r-package/blob/master/data/loan50.rda


# County

3142 rows and 11 columns

Data taken from openintro statistic's subset of the US Census Bureau’s American Community Survey (ACS)

* **name:** County name
* **state:** State where the county resides, or the District of Columbia.
* **pop:** Population in 2017
* **pop_change:** Percent change in the population from 2010 to 2017. For example, the value 1.48 in the first row means the population for this county increased by 1.48% from 2010 to 2017.
* **poverty:** Percent of the population in poverty.
* **homeownership:** Percent of the population that lives in their own home or lives with the owner, e.g. children living with parents who own the home.
* **multi_unit:** Percent of living units that are in multi-unit structures, e.g. apartments.
* **unemp_rate:** Unemployment rate as a percent.
* **metro:** Whether the county contains a metropolitan area.
* **median_edu:** Median education level, which can take a value among below hs, hs diploma, some college, and bachelors.
* **median_hh_income:** Median household income for the county, where a household’s income equals the total income of its occupants who are 15 years or older

#### Source
https://github.com/OpenIntroStat/openintro-r-package/blob/master/data/county.rda

# Email 50

50 rows, 21 columns

* **spam**
* **to_multiple**
* **from**
* **cc**
* **sent_mail**
* **time**
* **image**
* **attach**
* **dollar**
* **winner**
* **inherit**
* **viagra**
* **password**
* **num_char* number of characters in email**
* **line_breaks* number of line breaks in email**
* **format**
* **re_subj**
* **exclaim_subj**
* **urgent_subj**
* **exclaim_mess**
* **number**


#### Source
https://github.com/OpenIntroStat/openintro-r-package/tree/master/data

# Example 2.41
Ordered dataset to find the IQR

9 rows, 2 columns

* **data** ordered data to find the IQR
* **group** group data to use for single x-axis metric 

#### Source
Diez, David M, et al. 2019. OpenIntroStats: Advanced High School Statistics, Second Edition, with updates based on AP® Statistics Course Framework. 

# Example 2.48

4 rows, 1 column

* **data** ordered data to perform linear transformations

#### Source
Diez, David M, et al. 2019. OpenIntroStats: Advanced High School Statistics, Second Edition, with updates based on AP® Statistics Course Framework. 

# Oscars

Record of past Academy Award winners and nominees

* **gender:** sex of Oscar Winner
* **oscar_no:** the number Oscar
* **oscar_year:** year the Oscar was given
* **name:** Name of the awardee
* **movie:** Movie the awadee won the Oscar for
* **age:** Age of Oscar awardee
* **birth_pl:** Where the Oscar awardee was born
* **birth_mo:** Month Oscar awardee was born
* **birth_d:** Day Oscar awardee was born
* **birth_y:** Year the oscar awardee was born

## Source
Diez, David M, et al. 2019. OpenIntroStats: Advanced High School Statistics, Second Edition, with updates based on AP® Statistics Course Framework. R Package (openintro): `data(oscar)`

# Exercise 2.37
Final exam scores of twenty introductory statistics students from openintro Exersize 2.36

rows 20, columns 2

* **grade:** student's exam grade
* **group:** x-axis variable for plotting
