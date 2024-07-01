#include <ArduinoJson.h>
#define BLU 3  
#define GRN 5 
#define RED 6 

struct Color {
  unsigned char red;
  unsigned char green;
  unsigned char blue;
};

const int MAX_SHIFT_COUNT = 3;
const int MIN_COOKING_TIME = 3;
const int AVERAGE_COOKING_TIME = 6;
const int MAX_COOKING_TIME = 10;
const Color BEET = {255, 0, 0}; // Буряк - червоний
const Color POTATO = {0, 255, 255}; // Картопля - блакитний
const Color SOUR_CREAM = {255, 255, 255}; // Сметана - білий, трошки синюватий
const Color SAUSAGE = {0, 0, 255}; // Ковбаса - синій
const Color CARROT = {255, 0, 255}; // Морква - фіолетовий

void cookDish(Color color) {
   analogWrite(RED, 255 - color.red);
   analogWrite(GRN, 255 - color.green);
   analogWrite(BLU, 255 - color.blue);
}

class Ingredient {
public:
    Ingredient(int id, double weight_or_volume) :
        id(id), weight_or_volume(weight_or_volume) {}

    int get_id() const {
        return id;
    }

    double get_weight_or_volume() const {
        return weight_or_volume;
    }

    int get_cook_time_seconds() const {
        if (weight_or_volume < 50) {
            return MIN_COOKING_TIME;
        } else if (weight_or_volume < 100) {
            return AVERAGE_COOKING_TIME;
        } else {
            return MAX_COOKING_TIME;
        }
    }
private:
    int id;
    double weight_or_volume;
};

class Dish {
public:
    Dish(int id = -1, int ingredient_count = -1) 
        : id(id), ingredient_count(ingredient_count) {}

    int get_id() const {
        return id;
    }

    int get_ingredient_count() const {
        return ingredient_count;
    }

    void set_ingredient(int index, Ingredient ingredient) {
        if (index > -1 && index < ingredient_count) {
            ingredients[index] = Ingredient(ingredient.get_id(), ingredient.get_weight_or_volume());
        }
    }

    int get_cook_time_seconds() const {
        int cook_time = 0;
        for (int i = 0; i < ingredient_count; ++i) {
            cook_time += ingredients[i].get_cook_time_seconds();
        }
        return cook_time;
    }

    Ingredient* get_ingredient(int index) const {
        if (index > -1 && index < ingredient_count) {
            return &ingredients[index];
        }
        return nullptr;
    }
private: 
    int id;
    int ingredient_count;
    Ingredient* ingredients;
};

class Order {
public:
    Order(bool user_is_vip = false, int dish_count = 0, Dish* dish = nullptr, 
        int order_id = -1, int shift_count = 0, int index_number = 0)
    : user_is_vip(user_is_vip), order_id(order_id), index_number(index_number),
        shift_count(shift_count), dish(dish), dish_count(dish_count) {}

    bool is_user_vip() const {
        return user_is_vip;
    }
    
    const Dish* get_dish(int index) const {
        return &dish[index];
    }

    int get_order_id() const {
        return order_id;
    }

    int get_shift_count() const {
        return shift_count;
    }

    void increment_shift_count() {
        ++shift_count;
    }

    int get_dish_count() const {
      return dish_count; 
    }

    int get_cook_time_seconds() const {
        int cook_time = 0;
        for (int i = 0; i < dish_count; ++i) {
            cook_time += dish[i].get_cook_time_seconds();
        }
        return cook_time;
    }

    Order* get_next_order() {
        return next_order;
    }

    void set_next_order(Order* new_next_order) {
        next_order = new_next_order;
    }

    Order* get_previous_order() {
        return previous_order;
    }

    void set_previous_order(Order* new_previous_order) {
        previous_order = new_previous_order;
    }

    int get_index_number() const {
        return index_number;
    }

    void set_index_number(int new_number) {
        index_number = new_number;
    }
private:
    bool user_is_vip;
    int dish_count;
    int index_number;
    Dish* dish;
    int order_id;
    int shift_count;
    Order* next_order;
    Order* previous_order;
};

class Queue {
public:
    void add_new_order(Order* order) {
        if (last_order == nullptr) {
            first_order = last_order = order;
            order->set_next_order(nullptr);
            order->set_previous_order(nullptr);
            order->set_index_number(1);
        } else {
            if (!order->is_user_vip()) {
                order->set_next_order(last_order);
                order->set_previous_order(nullptr);
                last_order = order;
            } else {
                int order_index = size;
                Order* current_order = last_order;

                while (order_index >= size / 2) {
                    if (current_order->is_user_vip() 
                        || current_order->get_shift_count() 
                        == MAX_SHIFT_COUNT) {
                        break;
                    } else {
                        current_order->increment_shift_count();
                        current_order = current_order->get_next_order();
                    }
                    ++order_index;
                }

                int last_index = current_order->get_index_number();
                if (current_order == last_order) {
                    current_order->set_previous_order(order);
                    order->set_next_order(current_order);
                    order->set_previous_order(nullptr);
                    last_order = order;
                } else {
                    current_order->set_previous_order(order);
                    current_order->get_previous_order()->set_next_order(order);
                    order->set_next_order(current_order);
                    order->set_previous_order(
                        current_order->get_previous_order()
                    );
                }
                update_indexes(order, last_index);
            }
        }
        ++size;
    }

    Order* start_dish_cooking() {
        Order* order_to_cook = first_order;
        if (!size) {
            first_order = last_order = nullptr;
        } else {
            Order* new_first_order = first_order->get_previous_order();
            new_first_order->set_next_order(nullptr);

            if (size == 1) {
                new_first_order->set_previous_order(nullptr);
                first_order = last_order = new_first_order;
            }
        }

        return order_to_cook;
    }

    void update_indexes(Order* start_order, int index) {
        Order* current_order = start_order;
        int current_index = index;
        while (current_order) {
            current_order->set_index_number(current_index++);
            current_order = current_order->get_previous_order();
        }
    }

    Order* get_first_order() {
        return first_order;
    }

    int get_size() const {
        return size;
    }

private:
    Order* first_order;
    Order* last_order;
    int size;
};


Queue machine_queue;

String get_input() {
  String input_value;
  while(true) {
    String input_part = Serial.readString();
    if (!input_part.length()) {
      break;
    } else {
      input_value += input_part;
    }
  }

  return input_value;
}

void get_new_order_data(String input) {
  DynamicJsonDocument json(1024);
  deserializeJson(json, input);
  bool is_vip = json["is_vip"];
  int order = json["order"];
  int dishes_count = json["dishes"]["count"];

  Dish* dishes = new Dish[dishes_count];
  for (int i = 0; i < dishes_count; ++i) {
      int dish_id = json["dishes"]["data"][i]["id"];
      int dish_ingredient_count = json["dishes"]["data"][i]["count"];
      dishes[i] = Dish(dish_id, dish_ingredient_count);
      
      for (int j = 0; j < dish_ingredient_count; ++j) {
        Ingredient new_ingredient = Ingredient(
          json["dishes"]["data"][i]["ingredients"][j][0],
          json["dishes"]["data"][i]["ingredients"][j][1]
        );
        dishes[i].set_ingredient(i, new_ingredient);
      }
  }

  Order* new_order = new Order(is_vip, dishes_count, dishes, order, 0, 0);
  machine_queue.add_new_order(new_order);

//  return new_order;
}

//void send_new_order_data_to_server(Order* new_order) {
//  DynamicJsonDocument json(1024);
////  Order* current_order = machine_queue.get_first_order();
//  while(current_order) {
//    json["orders"][current_order_number]["index"] = new_order->get_index_number();
//    json["orders"][current_order_number]["cook_time"] = new_order->get_cook_time_seconds();
//  }
//  serializeJson(json, Serial);
//  Serial.write('\n');
//}

//Color choose_color_to_display(int ingredient_id) {
//  Color return_color;
//
//  switch() {
//    case 1:
//     {
//      return_color = POTATO;
//      break;
//     }
//     case 7:
//     {
//      return_color = SAUSAGE;  
//      break;
//     }
//     case 8:
//     {
//      return_color = SAUSAGE;  
//      break;
//     }
//     case 9:
//     {
//      return_color = SAUSAGE;  
//      break;
//     }
//     case 10:
//     {
//      return_color = SAUSAGE;  
//      break;
//     }
//     default: {
//      return_color = SAUSAGE;  
//      break;
//     }
//  }
//  return return_color;
//}
//
//void cook_order(Order* order) {
//  dish_count = order->get_dish_count();
//  for (int i = 0; i < dish_count; ++i) {
//    Dish* current_dish = order->get_dish(i);
//    int dish_ingredient_count = 
//        current_dish->get_ingredient_count();
//    for (int j = 0; j < dish_ingredient_count; ++i){
//      Ingredient* current_ingredient = current_dish->get_ingredient(j);
//      int ingredient_id = current_ingredient->get_id();
//    }
//  }
//}

void setup() {
  machine_queue = Queue();
  Serial.begin(9600); 
  while(!Serial) {
  }
}

void loop() {
  String input = get_input();
  if (input.length()) {
//    Order* new_order = 
    get_new_order_data(input);
//    send_new_order_data_to_server(new_order);
  }
//  if (machine_queue.get_size()) {
//    Order* order_to_cook = machine_queue.start_dish_cooking();
//  }
  delay(1000);  
}
