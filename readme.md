# Developer
Xiaoyi Wu and Jamin Tan


# Project Name
COVID-19's Impact on Human Mobility and Social Equity in NYC

# Interative map
https://xiaoyi-wu0711.github.io/mobility_web/

# Detailed report 
https://github.com/Xiaoyi-Wu0711/mobility_covid-19/blob/main/doc/report.pdf

## Introduction
As the most populous city in the United States with 8.8 million people distributed over 300.46 square miles (U.S Census Bureau, 2020), New York City has become the pandemic epicenter (Cordes & Castro, 2020) since the first confirmed case on March 1st. Especially, under the setting of holiday and Omicron variant, NYC experienced unprecedented transmission speed at 2022 New Year’s Eve. This study focuses on the spatio-temporal analysis of human mobility pattern in NYC to study COVID-19’s impact on travel behaviors, and social equity analysis in different contexts to help the government properly response to public health emergencies.
As the most populous city in the United States with 8.8 million people distributed over 300.46 square miles (U.S Census Bureau, 2020), New York City has experienced rapid and widespread transmission since the first confirmed case on March 1st 2020. At the end of March 2020, NYC arrived at the peak of COVID-19 and became the pandemic epicenter (Cordes \& Castro, 2020) with a weekly mean of 5132 diagnosed cases and 1,566 hospital admissions. On March 22, 2020, 'New York State on PAUSE' executive order was declared. It includes a new directive that all non-essential businesses statewide must close in-office personnel functions effective (New York State Official Website, 2020). Identifying the spatio-temporal changes of human mobility pattern before, during and after the outbreak of COVID-19 is important in order to analyze COVID-19’s impact on individuals. In addition, analyzing mobility changes under the contextual backgrounds suggests the heterogeneity of COVID-19’s impacts on different groups. For example, high-income individuals may choose to decrease their visits to wholesale markets and restaurants and buy takeaways services to access necessary foods. 
However, people with low- or moderate- incomes may have no choice but to leave home to buy food with higher risk of infection.
Therefore, the objective of this project is to study the spatio-temporal changes of mobility pattern in NYC in March 2019, March 2020 and March 2021 and analyze the social equity issues caused by the pandemic. 

## Data
This map uses the smart-device pattern data from December to January in 2019-2020, 2020-2021, 2021-2022 from SafeGraph. In addition, this study collect ACS 2019 5-year data to analyze mobility pattern in different race and income contexts to discuss the social equity issues and make policy implications of travel restrictions for the local government. 
@@ -23,3 +31,10 @@ Table 1.  Data
## Methods
- Aggravate the block group data to census tract level
- Comparing the spatial pattern of human mobility before and after COVID-19's outbreak


## Conclusion

- Manhanttan and JFK International Airport are the most popular place in NYC.
- All most every borough in NYC has experienced significant decrease in visit counts during the first month of COVID-19, and this decreasing trend ranging from March 2019 to March 2021.
![map of total visit counts in 2019](https://github.com/Xiaoyi-Wu0711/mobility_web/blob/main/fig/MAP_TOTAL_2019.png)
<p align="center">
    Total Visit in 2019
</p>

![map of total visit counts in 2020](https://github.com/Xiaoyi-Wu0711/mobility_web/blob/main/fig/MAP_TOTAL_2020.png)
<p align="center">
    Total Visit in 2020
</p>

![map of total visit counts in 2021](https://github.com/Xiaoyi-Wu0711/mobility_web/blob/main/fig/MAP_TOTAL_2021.png)
<p align="center">
    Total Visit in 2021
</p>
- Particularly, Upper Manhanttan has experienced large decreasing degree of visit count during the outbreak of COVID-19, however, they're the places with <b>high poverty rate</b>.

![poverty rate](https://github.com/Xiaoyi-Wu0711/mobility_web/blob/main/fig/poverty_rate.png)
<p align="center">
    Poverty Rate
</p>

- Necessay goods and services such as education, health care, food and wholesale and retail store are clusterring at Manhanttan. Thus, people have to take more visits to POIs in these categories in Manhanttan.

![total visit](https://github.com/Xiaoyi-Wu0711/mobility_web/blob/main/fig/total.png)
<p align="center">
    Visits to different boroughs 
</p>
- However, people visits most often to Queen Borough for transportation POIs, since JFK Internationl Airport and Laguardia Airport are location in Queens.

![transportation visit](https://github.com/Xiaoyi-Wu0711/mobility_web/blob/main/fig/trans.png)
<p align="center">
    Visits to transportation POIs in different boroughs
</p>