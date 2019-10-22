# Figure 1.2 
Using data from [Figure 1.1](https://raw.githubusercontent.com/MayaGans/tidyblocks-1/openintrostats/data/openintrostats/Figure_1_1.csv) aggregate data by when the measurement was taken, outcome and group. Then aggregate again to count for the total  outcomes per measurement time.

```
# all
dat %>% group_by(days, outcome, group) %>%
  summarise(count = n())

# totals
dat %>% group_by(days, outcome, group) %>%
  summarise(count = n()) %>%
  group_by(days, outcome) %>%
  summarise(total = sum(count)) 
```

# Guided Practice
What proportion of the patients in the treatment group had no stroke within the first 30 days of the study?
```
# guided practice
left <- dat %>% group_by(days, outcome, group) %>%
  summarise(count = n()) %>%
  filter(outcome == "no event" && days == "days0_30")

right <- dat %>% group_by(group) %>%
  summarise(total = n() / 2)

left_join(left, right, by = "group") %>%
  mutate(prop = count/total)
```

# Calculate Proportions
```
left <- dat %>% group_by(days, outcome, group) %>%
  summarise(count = n()) %>%
  filter(outcome == "stroke" && days == "days0_365")

right <- dat %>% group_by(group) %>%
  summarise(total = n() / 2)

left_join(left, right, by = "group") %>%
  mutate(prop = count/total)
```
