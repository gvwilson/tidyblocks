This folder contains the raw data files used within the TidyBlocks data blocks. 
To import your own csv data, be sure to use the **raw** github link!

# Earthquake Dataset
### Subset of the US Geological Survey data on Earthquakes in 2016

5 Columns, 798 rows

* **Time**: time of earthquake occurance
* **Latitude**: latitude (numeric)
* **Longitude**: longitude (numeric)
* **Depth_Km**: depth in kilometers (numeric)
* **Magnitude**: relative size of the earthquake (numeric)

# Iris Dataset

### Ronald Fisher's 1936 iris dataset from *The use of multiple measurements in taxonomic problems.* 

5 Columns, 150 rows

* **Sepal_Length**: in centemeters (numeric)
* **Sepal_Width**: in centemeters (numeric)
* **Petal_Length**: in centemeters (numeric)
* **Petal_Width**: in centemeters (numeric)
* **Species**: Iris species names (character)

#### Source
Fisher, R. A. (1936) The use of multiple measurements in taxonomic problems. Annals of Eugenics, 7, Part II, 179–188.
The data were collected by Anderson, Edgar (1935). The irises of the Gaspe Peninsula, Bulletin of the American Iris Society, 59, 2–5.

#### References
Becker, R. A., Chambers, J. M. and Wilks, A. R. (1988) The New S Language. Wadsworth & Brooks/Cole.

# Tooth Growth Dataset

### The response is the length of odontoblasts (cells responsible for tooth growth) in 60 guinea pigs. Each animal received one of three dose levels of vitamin C (0.5, 1, and 2 mg/day) by one of two delivery methods, orange juice or ascorbic acid (a form of vitamin C and coded as VC).

3 Columns, 60 rows

* **len**: tooth length (numeric)
* **supp**: factor supplement type (VC or OJ)
* **dose**: numeric dose (mg/day)

#### Source
C. I. Bliss (1952). The Statistics of Bioassay. Academic Press.

#### References
McNeil, D. R. (1977). Interactive Data Analysis. New York: Wiley.
Crampton, E. W. (1947). The growth of the odontoblast of the incisor teeth as a criterion of vitamin C intake of the guinea pig. The Journal of Nutrition, 33(5), 491–504. doi: 10.1093/jn/33.5.491.

# MT Cars Dataset

### The data was extracted from the 1974 Motor Trend US magazine, and comprises fuel consumption and 10 aspects of automobile design and performance for 32 automobiles (1973–74 models).

12 Columns, 32 rows

* **make**: unique row names (character)
* **mpg**: miles/(US) gallon (numeric)
* **cyl**: number of cylinders (numeric)
* **disp**: displacement (cu.in.) (numeric)
* **hp**: gross horsepower (numeric)
* **drat**: rear axle ratio (numeric)
* **wt**: weight (numeric)
* **qsec**: 1/4 mile time (numeric)
* **vs**: engine (0 = V-shaped, 1 = straight) (categorical)
* **am**: transmission (0 = automatic, 1 = manual) (categorical)
* **gear**: number of forward gears (numeric)
* **carb**: number of carburetors (numeric)

#### Source
Henderson and Velleman (1981), Building multiple regression models interactively. Biometrics, 37, 391–411.
