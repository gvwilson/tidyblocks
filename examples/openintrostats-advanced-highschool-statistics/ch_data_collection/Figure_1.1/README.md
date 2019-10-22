# Figure 1.2 
Using data from [Figure 1.1](https://raw.githubusercontent.com/MayaGans/tidyblocks-1/openintrostats/data/openintrostats/Figure_1_1.csv) aggregate data by when the measurement was taken, outcome and group. Then aggregate again to count for the total  outcomes per measurement time.

```
# all
fig %>% group_by(days, outcome, group) %>%
  summarise(count = n())

# totals
fig %>% group_by(days, outcome, group) %>%
  summarise(count = n()) %>%
  group_by(days, outcome) %>%
  summarise(total = sum(count)) 
```

# Calculate Proportions
```
f1 <- fig %>% group_by(days, outcome, group) %>%
  summarise(count = n()) %>%
  filter(outcome == "stroke" && days == "days0_365")

f2 <- fig %>% group_by(group) %>%
  summarise(total = n() / 2)

left_join(f1, f2, by = "group") %>%
  mutate(prop = count/total)
```
